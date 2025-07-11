import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class ForgeService {
  private readonly logger = new Logger(ForgeService.name);
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(private configService: ConfigService) {}

  async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const clientId = this.configService.get<string>('FORGE_CLIENT_ID');
      const clientSecret = this.configService.get<string>('FORGE_CLIENT_SECRET');
      const scope = 'viewables:read data:read data:write data:create bucket:create bucket:read';

      const response = await axios.post(
        'https://developer.api.autodesk.com/authentication/v1/authenticate',
        new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'client_credentials',
          scope: scope,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      this.accessToken = response.data.access_token;
      // Set expiry with 5 minute buffer
      this.tokenExpiry = Date.now() + (response.data.expires_in - 300) * 1000;

      this.logger.log('Successfully obtained Forge access token');
      return this.accessToken;
    } catch (error) {
      this.logger.error('Failed to get Forge access token', error);
      throw error;
    }
  }

  async createBucket(bucketKey: string): Promise<any> {
    const token = await this.getAccessToken();

    try {
      const response = await axios.post(
        'https://developer.api.autodesk.com/oss/v2/buckets',
        {
          bucketKey,
          policyKey: 'transient',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data;
    } catch (error) {
      if (error.response?.status === 409) {
        // Bucket already exists
        return { bucketKey };
      }
      throw error;
    }
  }

  async uploadFile(
    bucketKey: string,
    objectName: string,
    fileBuffer: Buffer,
  ): Promise<any> {
    const token = await this.getAccessToken();

    const response = await axios.put(
      `https://developer.api.autodesk.com/oss/v2/buckets/${bucketKey}/objects/${objectName}`,
      fileBuffer,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/octet-stream',
        },
      },
    );

    return response.data;
  }

  async translateModel(urn: string): Promise<any> {
    const token = await this.getAccessToken();

    const response = await axios.post(
      'https://developer.api.autodesk.com/modelderivative/v2/designdata/job',
      {
        input: {
          urn,
        },
        output: {
          formats: [
            {
              type: 'svf',
              views: ['2d', '3d'],
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'x-ads-force': 'true',
        },
      },
    );

    return response.data;
  }

  async getTranslationStatus(urn: string): Promise<any> {
    const token = await this.getAccessToken();

    const response = await axios.get(
      `https://developer.api.autodesk.com/modelderivative/v2/designdata/${urn}/manifest`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  }
}

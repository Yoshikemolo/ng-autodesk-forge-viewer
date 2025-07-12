import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SettingsService } from '../settings/settings.service';
import axios from 'axios';

@Injectable()
export class ForgeService {
  private readonly logger = new Logger(ForgeService.name);
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(
    private configService: ConfigService,
    private settingsService: SettingsService,
  ) {
    console.log('🔧 ForgeService constructor called');
  }

  async getAccessToken(): Promise<string> {
    this.logger.log('🔴 ForgeService.getAccessToken called');
    
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      this.logger.log('✅ Returning cached access token');
      return this.accessToken;
    }

    try {
      this.logger.log('🔍 Attempting to get credentials from database...');
      // Try to get credentials from database first
      let clientId = await this.settingsService.getForgeClientId();
      let clientSecret = await this.settingsService.getForgeClientSecret();

      this.logger.log(`🔍 Database credentials - ClientID: ${clientId ? 'present' : 'missing'}, ClientSecret: ${clientSecret ? 'present' : 'missing'}`);
      
      if (clientId) {
        this.logger.log(`🔍 ClientID from DB: ${clientId.substring(0, 8)}...`);
      }
      if (clientSecret) {
        this.logger.log(`🔍 ClientSecret from DB: ${clientSecret.substring(0, 8)}...`);
      }

      // Fallback to environment variables if not found in database
      if (!clientId) {
        clientId = this.configService.get<string>('FORGE_CLIENT_ID');
        this.logger.log('🔍 Using ClientID from environment variables');
      }
      if (!clientSecret) {
        clientSecret = this.configService.get<string>('FORGE_CLIENT_SECRET');
        this.logger.log('🔍 Using ClientSecret from environment variables');
      }

      // Check if we have valid credentials
      if (!clientId || !clientSecret || 
          clientId === 'your_forge_client_id_here' || 
          clientSecret === 'your_forge_client_secret_here') {
        this.logger.error('❌ Invalid or missing Forge credentials');
        this.logger.error(`❌ ClientID: ${clientId || 'MISSING'}`);
        this.logger.error(`❌ ClientSecret: ${clientSecret ? 'present' : 'MISSING'}`);
        throw new BadRequestException(
          'Forge credentials not configured. Please set them in the Settings menu.'
        );
      }

      this.logger.log(`🔍 Making request to Forge with ClientID: ${clientId.substring(0, 8)}...`);

      const scope = 'viewables:read data:read data:write data:create bucket:create bucket:read';
      
      this.logger.log(`🔍 Forge API URL: https://developer.api.autodesk.com/authentication/v1/authenticate`);
      this.logger.log(`🔍 Scope: ${scope}`);

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

      this.logger.log(`✅ Forge API response status: ${response.status}`);
      this.logger.log(`✅ Forge API response data keys: ${Object.keys(response.data || {}).join(', ')}`);

      this.accessToken = response.data.access_token;
      // Set expiry with 5 minute buffer
      this.tokenExpiry = Date.now() + (response.data.expires_in - 300) * 1000;

      this.logger.log('✅ Successfully obtained Forge access token');
      return this.accessToken;
    } catch (error) {
      this.logger.error('❌ Failed to get Forge access token');
      this.logger.error(`❌ Error message: ${error.message}`);
      this.logger.error(`❌ Error response status: ${error.response?.status}`);
      this.logger.error(`❌ Error response data: ${JSON.stringify(error.response?.data)}`);
      this.logger.error(`❌ Full error:`, error);
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

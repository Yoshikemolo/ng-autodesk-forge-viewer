import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { environment } from '../../environments/environment';

interface AccessToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface GraphQLResponse {
  data: {
    getForgeToken: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ForgeService {
  private accessToken: AccessToken | null = null;
  private tokenExpiry: number = 0;

  constructor(private http: HttpClient) {}

  initialize(): void {
    console.log('Forge Service initialized');
  }

  async getAccessToken(): Promise<AccessToken> {
    // Check if we have a valid cached token
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    // Fetch new token from backend using GraphQL
    return this.fetchAccessTokenGraphQL();
  }

  private async fetchAccessTokenGraphQL(): Promise<AccessToken> {
    try {
      console.log('Fetching Forge token via GraphQL...');
      
      const query = {
        query: `query { getForgeToken }`
      };

      const response = await this.http.post<GraphQLResponse>(environment.graphqlEndpoint, query).toPromise();
      
      if (response?.data?.getForgeToken) {
        const tokenString = response.data.getForgeToken;
        
        // Create token object in expected format
        const token: AccessToken = {
          access_token: tokenString,
          token_type: 'Bearer',
          expires_in: 3600 // Default 1 hour
        };
        
        this.accessToken = token;
        // Set expiry with 5 minute buffer
        this.tokenExpiry = Date.now() + ((token.expires_in - 300) * 1000);
        
        console.log('Forge token obtained successfully via GraphQL');
        return token;
      }
      
      throw new Error('Failed to get access token from GraphQL response');
    } catch (error) {
      console.error('Error fetching access token via GraphQL:', error);
      throw error;
    }
  }

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${environment.apiUrl}/forge/upload`, formData);
  }

  translateModel(urn: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/forge/translate`, { urn });
  }

  getTranslationStatus(urn: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/forge/translate/${urn}/status`);
  }

  getModels(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/forge/models`);
  }
}

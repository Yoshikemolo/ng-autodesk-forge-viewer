import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Setting {
  id: string;
  key: string;
  value: string;
  description?: string;
  isEncrypted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ForgeCredentialsStatus {
  hasClientId: boolean;
  hasClientSecret: boolean;
  clientId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private apiUrl = `${environment.apiUrl}/settings`;

  constructor(private http: HttpClient) {}

  getAllSettings(): Observable<Setting[]> {
    return this.http.get<Setting[]>(this.apiUrl);
  }

  getSetting(key: string): Observable<Setting> {
    return this.http.get<Setting>(`${this.apiUrl}/${key}`);
  }

  createSetting(setting: Partial<Setting>): Observable<Setting> {
    return this.http.post<Setting>(this.apiUrl, setting);
  }

  updateSetting(key: string, setting: Partial<Setting>): Observable<Setting> {
    return this.http.patch<Setting>(`${this.apiUrl}/${key}`, setting);
  }

  deleteSetting(key: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${key}`);
  }

  setForgeCredentials(clientId: string, clientSecret: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/forge-credentials`, {
      clientId,
      clientSecret
    });
  }

  getForgeCredentialsStatus(): Observable<ForgeCredentialsStatus> {
    return this.http.get<ForgeCredentialsStatus>(`${this.apiUrl}/forge-credentials/status`);
  }

  deleteForgeCredentials(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/forge-credentials`);
  }
}

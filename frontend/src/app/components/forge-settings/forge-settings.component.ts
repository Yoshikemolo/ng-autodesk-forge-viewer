import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingsService, ForgeCredentialsStatus } from '../../services/settings.service';

@Component({
  selector: 'app-forge-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="forge-settings">
      <div class="settings-header">
        <h2>Autodesk Forge Configuration</h2>
        <p class="description">
          Configure your Autodesk Forge credentials to enable model viewing functionality.
          Your credentials will be securely stored and encrypted.
        </p>
      </div>

      <div class="credentials-status" *ngIf="credentialsStatus">
        <div class="status-card" [class.configured]="isConfigured" [class.not-configured]="!isConfigured">
          <div class="status-icon">
            <span *ngIf="isConfigured">✅</span>
            <span *ngIf="!isConfigured">⚠️</span>
          </div>
          <div class="status-content">
            <h3>{{ isConfigured ? 'Credentials Configured' : 'Credentials Required' }}</h3>
            <p *ngIf="isConfigured">
              Client ID: {{ credentialsStatus.clientId }}
            </p>
            <p *ngIf="!isConfigured">
              Please configure your Autodesk Forge credentials to use the application.
            </p>
          </div>
        </div>
      </div>

      <form [formGroup]="forgeForm" (ngSubmit)="onSubmit()" class="forge-form">
        <div class="form-group">
          <label for="clientId">Client ID</label>
          <input
            type="text"
            id="clientId"
            formControlName="clientId"
            placeholder="Enter your Forge Client ID"
            [class.error]="forgeForm.get('clientId')?.invalid && forgeForm.get('clientId')?.touched"
          />
          <div class="error-message" *ngIf="forgeForm.get('clientId')?.invalid && forgeForm.get('clientId')?.touched">
            <span *ngIf="forgeForm.get('clientId')?.errors?.['required']">Client ID is required</span>
            <span *ngIf="forgeForm.get('clientId')?.errors?.['minlength']">Client ID is too short</span>
          </div>
        </div>

        <div class="form-group">
          <label for="clientSecret">Client Secret</label>
          <input
            type="password"
            id="clientSecret"
            formControlName="clientSecret"
            placeholder="Enter your Forge Client Secret"
            [class.error]="forgeForm.get('clientSecret')?.invalid && forgeForm.get('clientSecret')?.touched"
          />
          <div class="error-message" *ngIf="forgeForm.get('clientSecret')?.invalid && forgeForm.get('clientSecret')?.touched">
            <span *ngIf="forgeForm.get('clientSecret')?.errors?.['required']">Client Secret is required</span>
            <span *ngIf="forgeForm.get('clientSecret')?.errors?.['minlength']">Client Secret is too short</span>
          </div>
        </div>

        <div class="form-actions">
          <button 
            type="submit" 
            class="btn btn-primary"
            [disabled]="forgeForm.invalid || isLoading"
          >
            {{ isLoading ? 'Saving...' : 'Save Credentials' }}
          </button>
          <button 
            type="button" 
            class="btn btn-secondary"
            (click)="onCancel()"
            [disabled]="isLoading"
          >
            Cancel
          </button>
          <button 
            type="button" 
            class="btn btn-danger"
            (click)="onDeleteCredentials()"
            [disabled]="isLoading || !isConfigured"
          >
            {{ isLoading ? 'Deleting...' : 'Clear Credentials' }}
          </button>
        </div>
      </form>

      <div class="help-section">
        <h3>How to get Forge credentials:</h3>
        <ol>
          <li>Visit the <a href="https://forge.autodesk.com/" target="_blank">Autodesk Forge website</a></li>
          <li>Sign in or create an account</li>
          <li>Navigate to <a href="https://aps.autodesk.com/myapps/" target="_blank">My Apps</a> and create a new app</li>
          <li>Select the required APIs: <strong>Data Management API</strong> and <strong>Model Derivative API</strong></li>
          <li>Copy the Client ID and Client Secret from your app details</li>
        </ol>
        
        <div class="credential-format">
          <h4>Expected format:</h4>
          <p><strong>Client ID:</strong> Alphanumeric string provided by Autodesk</p>
          <p><strong>Example:</strong> <code>gBfAVKIiwu5yvOcUuGOGFoFIZZD4dQ1EuXymMaLvQYIgsRAz</code></p>
          <p><strong>Client Secret:</strong> Longer alphanumeric string provided by Autodesk</p>
          <p><strong>Note:</strong> Copy these values exactly from your Autodesk Forge app page</p>
        </div>

        <div class="warning-section">
          <h4>⚠️ Important:</h4>
          <ul>
            <li>Make sure your credentials are from a real Autodesk Forge app</li>
            <li>The Client Secret will be encrypted and stored securely</li>
            <li>Invalid credentials will result in authentication errors</li>
          </ul>
        </div>
      </div>

      <div class="success-message" *ngIf="successMessage">
        {{ successMessage }}
      </div>

      <div class="error-message" *ngIf="errorMessage">
        {{ errorMessage }}
      </div>
    </div>
  `,
  styles: [`
    .forge-settings {
      max-width: 600px;
      margin: 0 auto;
      padding: 2rem;
    }

    .settings-header {
      margin-bottom: 2rem;
      text-align: center;
    }

    .settings-header h2 {
      color: #333;
      margin-bottom: 0.5rem;
    }

    .description {
      color: #666;
      line-height: 1.5;
    }

    .credentials-status {
      margin-bottom: 2rem;
    }

    .status-card {
      display: flex;
      align-items: center;
      padding: 1rem;
      border-radius: 8px;
      border: 2px solid;
    }

    .status-card.configured {
      background-color: #f0f9f0;
      border-color: #28a745;
    }

    .status-card.not-configured {
      background-color: #fff8f0;
      border-color: #ffc107;
    }

    .status-icon {
      font-size: 1.5rem;
      margin-right: 1rem;
    }

    .status-content h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
    }

    .status-content p {
      margin: 0;
      color: #666;
    }

    .forge-form {
      background: #f8f9fa;
      padding: 2rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #333;
    }

    .form-group input {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #dee2e6;
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }

    .form-group input:focus {
      outline: none;
      border-color: #007bff;
    }

    .form-group input.error {
      border-color: #dc3545;
    }

    .error-message {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .success-message {
      background-color: #d4edda;
      color: #155724;
      padding: 1rem;
      border-radius: 4px;
      margin-top: 1rem;
      border: 1px solid #c3e6cb;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: all 0.2s;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #0056b3;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover:not(:disabled) {
      background-color: #545b62;
    }

    .btn-danger {
      background-color: #dc3545;
      color: white;
    }

    .btn-danger:hover:not(:disabled) {
      background-color: #c82333;
    }

    .help-section {
      background: #e9ecef;
      padding: 1.5rem;
      border-radius: 8px;
      margin-top: 2rem;
    }

    .help-section h3 {
      margin-top: 0;
      color: #333;
    }

    .help-section ol {
      margin-bottom: 0;
    }

    .help-section li {
      margin-bottom: 0.5rem;
    }

    .help-section a {
      color: #007bff;
      text-decoration: none;
    }

    .help-section a:hover {
      text-decoration: underline;
    }

    .credential-format {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 4px;
      margin: 1rem 0;
    }

    .credential-format h4 {
      margin-top: 0;
      margin-bottom: 0.5rem;
      color: #333;
    }

    .credential-format p {
      margin: 0.25rem 0;
      font-size: 0.9rem;
    }

    .credential-format code {
      background: #e9ecef;
      padding: 2px 4px;
      border-radius: 3px;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    }

    .warning-section {
      background: #fff3cd;
      border: 1px solid #ffeaa7;
      padding: 1rem;
      border-radius: 4px;
      margin: 1rem 0;
    }

    .warning-section h4 {
      margin-top: 0;
      margin-bottom: 0.5rem;
      color: #856404;
    }

    .warning-section ul {
      margin: 0;
      padding-left: 1.5rem;
    }

    .warning-section li {
      margin-bottom: 0.25rem;
      color: #856404;
      font-size: 0.9rem;
    }
  `]
})
export class ForgeSettingsComponent implements OnInit {
  forgeForm: FormGroup;
  credentialsStatus: ForgeCredentialsStatus | null = null;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService
  ) {
    this.forgeForm = this.fb.group({
      clientId: ['', [
        Validators.required,
        Validators.minLength(10)
      ]],
      clientSecret: ['', [
        Validators.required,
        Validators.minLength(10)
      ]]
    });
  }

  ngOnInit(): void {
    this.loadCredentialsStatus();
  }

  get isConfigured(): boolean {
    return this.credentialsStatus?.hasClientId && this.credentialsStatus?.hasClientSecret || false;
  }

  loadCredentialsStatus(): void {
    this.settingsService.getForgeCredentialsStatus().subscribe({
      next: (status) => {
        this.credentialsStatus = status;
      },
      error: (error) => {
        console.error('Error loading credentials status:', error);
        this.errorMessage = 'Failed to load credentials status';
      }
    });
  }

  onSubmit(): void {
    if (this.forgeForm.valid) {
      this.isLoading = true;
      this.successMessage = '';
      this.errorMessage = '';

      const { clientId, clientSecret } = this.forgeForm.value;

      this.settingsService.setForgeCredentials(clientId, clientSecret).subscribe({
        next: (response) => {
          this.successMessage = response.message;
          this.forgeForm.reset();
          this.loadCredentialsStatus();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error saving credentials:', error);
          this.errorMessage = 'Failed to save credentials. Please try again.';
          this.isLoading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.forgeForm.reset();
    this.successMessage = '';
    this.errorMessage = '';
  }

  onDeleteCredentials(): void {
    if (confirm('Are you sure you want to delete the stored Forge credentials?')) {
      this.isLoading = true;
      this.successMessage = '';
      this.errorMessage = '';

      this.settingsService.deleteForgeCredentials().subscribe({
        next: () => {
          this.successMessage = 'Credentials deleted successfully';
          this.loadCredentialsStatus();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error deleting credentials:', error);
          this.errorMessage = 'Failed to delete credentials. Please try again.';
          this.isLoading = false;
        }
      });
    }
  }
}

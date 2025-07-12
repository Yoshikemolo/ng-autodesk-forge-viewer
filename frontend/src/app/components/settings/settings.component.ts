import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgeSettingsComponent } from '../forge-settings/forge-settings.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ForgeSettingsComponent],
  template: `
    <div class="settings-container">
      <div class="settings-header">
        <h1>Settings</h1>
        <p>Configure your application settings</p>
      </div>

      <div class="settings-content">
        <div class="settings-tabs">
          <button 
            class="tab-button"
            [class.active]="activeTab === 'forge'"
            (click)="setActiveTab('forge')"
          >
            <span class="tab-icon">🔧</span>
            Autodesk Forge
          </button>
          <button 
            class="tab-button"
            [class.active]="activeTab === 'general'"
            (click)="setActiveTab('general')"
          >
            <span class="tab-icon">⚙️</span>
            General
          </button>
        </div>

        <div class="tab-content">
          <app-forge-settings *ngIf="activeTab === 'forge'"></app-forge-settings>
          
          <div *ngIf="activeTab === 'general'" class="general-settings">
            <h2>General Settings</h2>
            <p>General application settings will be available here in future updates.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .settings-header {
      background-color: #f8f9fa;
      padding: 2rem;
      border-bottom: 1px solid #dee2e6;
      text-align: center;
    }

    .settings-header h1 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .settings-header p {
      margin: 0;
      color: #666;
    }

    .settings-content {
      flex: 1;
      display: flex;
    }

    .settings-tabs {
      width: 250px;
      background-color: #f8f9fa;
      border-right: 1px solid #dee2e6;
      padding: 1rem 0;
    }

    .tab-button {
      width: 100%;
      display: flex;
      align-items: center;
      padding: 1rem 1.5rem;
      border: none;
      background: none;
      text-align: left;
      cursor: pointer;
      transition: all 0.2s;
      color: #666;
      font-size: 1rem;
    }

    .tab-button:hover {
      background-color: #e9ecef;
      color: #333;
    }

    .tab-button.active {
      background-color: #007bff;
      color: white;
      font-weight: 600;
    }

    .tab-icon {
      margin-right: 0.75rem;
      font-size: 1.2rem;
    }

    .tab-content {
      flex: 1;
      overflow-y: auto;
    }

    .general-settings {
      padding: 2rem;
      text-align: center;
    }

    .general-settings h2 {
      color: #333;
      margin-bottom: 1rem;
    }

    .general-settings p {
      color: #666;
    }
  `]
})
export class SettingsComponent {
  activeTab = 'forge';

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}

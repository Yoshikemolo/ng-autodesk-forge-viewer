import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgeViewerComponent } from './components/forge-viewer/forge-viewer.component';
import { SettingsComponent } from './components/settings/settings.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ForgeViewerComponent, SettingsComponent],
  template: `
    <div class="app-container">
      <header class="app-header">
        <div class="header-content">
          <h1>NgAutodeskForgeViewer</h1>
          <nav class="header-nav">
            <button 
              class="nav-button"
              [class.active]="currentView === 'viewer'"
              (click)="setCurrentView('viewer')"
            >
              <span class="nav-icon">🏠</span>
              Viewer
            </button>
            <button 
              class="nav-button"
              [class.active]="currentView === 'settings'"
              (click)="setCurrentView('settings')"
            >
              <span class="nav-icon">⚙️</span>
              Settings
            </button>
          </nav>
        </div>
      </header>
      <main class="app-main">
        <app-forge-viewer *ngIf="currentView === 'viewer'"></app-forge-viewer>
        <app-settings *ngIf="currentView === 'settings'"></app-settings>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .app-header {
      background-color: #2c3e50;
      color: white;
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
    }

    .app-header h1 {
      margin: 0;
      font-size: 1.5rem;
    }

    .header-nav {
      display: flex;
      gap: 0.5rem;
    }

    .nav-button {
      display: flex;
      align-items: center;
      padding: 0.5rem 1rem;
      border: none;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 0.9rem;
    }

    .nav-button:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .nav-button.active {
      background: rgba(255, 255, 255, 0.3);
      font-weight: 600;
    }

    .nav-icon {
      margin-right: 0.5rem;
      font-size: 1rem;
    }

    .app-main {
      flex: 1;
      overflow: hidden;
    }
  `]
})
export class AppComponent {
  title = 'NgAutodeskForgeViewer';
  currentView: 'viewer' | 'settings' = 'viewer';

  setCurrentView(view: 'viewer' | 'settings'): void {
    this.currentView = view;
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgeViewerComponent } from './components/forge-viewer/forge-viewer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ForgeViewerComponent],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>NgAutodeskForgeViewer</h1>
      </header>
      <main class="app-main">
        <app-forge-viewer></app-forge-viewer>
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

    .app-header h1 {
      margin: 0;
      font-size: 1.5rem;
    }

    .app-main {
      flex: 1;
      overflow: hidden;
    }
  `]
})
export class AppComponent {
  title = 'NgAutodeskForgeViewer';
}

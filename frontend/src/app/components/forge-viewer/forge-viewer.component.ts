import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgeService } from '../../services/forge.service';
import { ThreeJsToolService } from '../../services/threejs-tool.service';

declare const Autodesk: any;

@Component({
  selector: 'app-forge-viewer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="viewer-container">
      <div class="viewer-toolbar">
        <button (click)="loadSampleModel()" [disabled]="loading" class="btn btn-primary">
          Load Sample Model
        </button>
        <button (click)="toggleThreeJsTool()" [disabled]="!viewer" class="btn btn-secondary">
          {{ threeJsToolActive ? 'Disable' : 'Enable' }} ThreeJS Tool
        </button>
      </div>
      <div #viewerContainer class="forge-viewer" [class.loading]="loading">
        <div *ngIf="loading" class="loading-spinner">
          <div class="spinner"></div>
          <p>Loading viewer...</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .viewer-container {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .viewer-toolbar {
      background-color: #f8f9fa;
      padding: 1rem;
      border-bottom: 1px solid #dee2e6;
      display: flex;
      gap: 1rem;
    }

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.875rem;
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

    .forge-viewer {
      flex: 1;
      position: relative;
      background-color: #e9ecef;
    }

    .forge-viewer.loading {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .loading-spinner {
      text-align: center;
    }

    .loading-spinner p {
      margin-top: 1rem;
      color: #6c757d;
    }
  `]
})
export class ForgeViewerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('viewerContainer', { static: false }) viewerContainer!: ElementRef;

  viewer: any;
  loading = false;
  threeJsToolActive = false;

  // Sample model URN (you'll need to replace this with a real URN)
  sampleModelUrn = 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6c2FtcGxlLWJ1Y2tldC9zYW1wbGUtbW9kZWwucnZ0';

  constructor(
    private forgeService: ForgeService,
    private threeJsToolService: ThreeJsToolService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Initialize Forge service
    this.forgeService.initialize();
  }

  ngAfterViewInit(): void {
    // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.initializeViewer();
    }, 0);
  }

  ngOnDestroy(): void {
    if (this.viewer) {
      this.viewer.finish();
      this.viewer = null;
    }
  }

  private async initializeViewer(): Promise<void> {
    this.loading = true;
    this.cdr.detectChanges(); // Force change detection after setting loading state

    try {
      // Get access token
      const token = await this.forgeService.getAccessToken();

      // Initialize viewer
      const options = {
        env: 'AutodeskProduction',
        api: 'derivativeV2',
        getAccessToken: (callback: Function) => {
          callback(token.access_token, token.expires_in);
        }
      };

      Autodesk.Viewing.Initializer(options, () => {
        const container = this.viewerContainer.nativeElement;
        this.viewer = new Autodesk.Viewing.GuiViewer3D(container);
        
        const startedCode = this.viewer.start();
        if (startedCode > 0) {
          console.error('Failed to create a Viewer: WebGL not supported.');
          this.loading = false;
          this.cdr.detectChanges();
          return;
        }

        // Register custom tool
        this.threeJsToolService.registerTool(this.viewer);

        console.log('Viewer initialized successfully');
        this.loading = false;
        this.cdr.detectChanges();
      });
    } catch (error) {
      console.error('Error initializing viewer:', error);
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async loadSampleModel(): Promise<void> {
    if (!this.viewer) return;

    this.loading = true;
    this.cdr.detectChanges();

    try {
      // For demo purposes, we'll use a sample URN
      // In production, you would get this from your backend
      const documentId = `urn:${this.sampleModelUrn}`;

      Autodesk.Viewing.Document.load(
        documentId,
        (doc: any) => {
          const viewables = doc.getRoot().getDefaultGeometry();
          if (viewables) {
            this.viewer.loadDocumentNode(doc, viewables).then(() => {
              console.log('Model loaded successfully');
              this.loading = false;
              this.cdr.detectChanges();
            });
          }
        },
        (errorCode: string, errorMsg: string) => {
          console.error('Failed to load model:', errorCode, errorMsg);
          this.loading = false;
          this.cdr.detectChanges();
        }
      );
    } catch (error) {
      console.error('Error loading model:', error);
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  toggleThreeJsTool(): void {
    if (!this.viewer) return;

    this.threeJsToolActive = !this.threeJsToolActive;

    if (this.threeJsToolActive) {
      this.viewer.toolController.activateTool('ThreeJsAnnotationTool');
    } else {
      this.viewer.toolController.deactivateTool('ThreeJsAnnotationTool');
    }
  }
}

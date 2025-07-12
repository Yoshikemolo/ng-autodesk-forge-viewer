import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgeService } from '../../services/forge.service';
import { ThreeJsToolService } from '../../services/threejs-tool.service';
import { ModelSelectorExtension } from './model-selector.extension';
import * as utils from './utils';
import * as THREE from 'three';

declare const Autodesk: any;

@Component({
  selector: 'app-forge-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './forge-viewer.component.html',
  styleUrls: ['./forge-viewer.component.scss']
})
export class ForgeViewerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('viewerContainer', { static: false }) viewerContainer!: ElementRef;

  viewer: any;
  loading = false;
  threeJsToolActive = false;
  modelSelectorExtension: ModelSelectorExtension | null = null;

  // Demo models for the dropdown
  models: { name: string; urn: string }[] = [];

  // Sample model URN - using known working Autodesk sample models
  sampleModelUrn = 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Zm9yZ2V0aXQtYnVja2V0L3JhY19hZHZhbmNlZF9zYW1wbGVfcHJvamVjdC5ydnQ';

  // Alternative sample URNs to try if the main one fails
  alternativeUrns = [
    'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Zm9yZ2V0aXQtYnVja2V0L3JhY19iYXNpY19zYW1wbGVfcHJvamVjdC5ydnQ',
    'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6c2FtcGxlZmlsZXNfYnVja2V0L3NhbXBsZS5ydnQ'
  ];

  constructor(
    private forgeService: ForgeService,
    private threeJsToolService: ThreeJsToolService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // Initialize Forge service
    this.forgeService.initialize();
    // get dynamic models
    utils.listModels().then(models => {
      this.models = models;
      console.log('[ForgeViewer] Available models:', this.models);
    });
  }

  ngAfterViewInit(): void {
    // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.initializeViewer();
      this.cdr.detectChanges(); // Ensure change detection runs after models are loaded
    }, 0);
  }

  ngOnDestroy(): void {
    // Clean up model selector extension
    if (this.modelSelectorExtension) {
      this.modelSelectorExtension.unload();
      this.modelSelectorExtension = null;
    }

    if (this.viewer) {
      this.viewer.finish();
      this.viewer = null;
    }
  }

  private async initializeViewer(): Promise<void> {
    this.loading = true;
    this.cdr.detectChanges(); // Force change detection after setting loading state

    try {
      console.log('Starting Forge Viewer initialization...');

      // Get access token
      const token = await this.forgeService.getAccessToken();
      console.log('Token obtained for viewer initialization');

      // Initialize viewer
      const options = {
        env: 'AutodeskProduction',
        api: 'derivativeV2',
        getAccessToken: (callback: Function) => {
          callback(token.access_token, token.expires_in);
        }
      };

      console.log('Calling Autodesk.Viewing.Initializer...');

      Autodesk.Viewing.Initializer(options, () => {
        console.log('Forge Viewer initialized, creating GuiViewer3D...');

        const container = this.viewerContainer.nativeElement;
        console.log('Container element:', container);

        this.viewer = new Autodesk.Viewing.GuiViewer3D(container, {
          showProgress: true,
          // Enable essential UI components - these are critical for toolbar visibility
          showViewerToolBar: true,
          showControlBar: true,
          enableHotkeys: true,
          showNavigation: true,
          // Additional toolbar and UI related options
          showToolbar: true,         // Explicitly show toolbar
          enableToolbar: true,       // Enable toolbar functionality  
          useViewCube: true,         // Ensure ViewCube is enabled
          // Navigation and interaction options
          enableTouchGestures: true,
          enableMouseMiddleButtonZoom: true,
          // UI customization options
          allowMenuAccess: true,
          hasSelectionTree: true,
          showSearchBar: true,
          // Force UI creation
          createUI: true,
          // Environment settings that can affect UI
          env: 'AutodeskProduction'
        });

        console.log('GuiViewer3D created, starting viewer...');

        const startedCode = this.viewer.start();
        console.log('Viewer start code:', startedCode);

        if (startedCode > 0) {
          console.error('Failed to create a Viewer: WebGL not supported.');
          this.loading = false;
          this.cdr.detectChanges();
          return;
        }

        // Give the viewer more time to initialize before trying to load UI extensions
        setTimeout(() => {
          console.log('Loading essential viewer extensions...');

          // Load essential extensions for basic functionality
          const essentialExtensions = [
            'Autodesk.ViewCubeUi',
            'Autodesk.DefaultTools.NavTools',
            'Autodesk.ModelStructure',
            'Autodesk.PropertiesManager'
          ];

          // Load extensions one by one with proper error handling
          this.loadExtensionsSequentially(essentialExtensions)
            .then(() => {
              console.log('✅ Essential extensions loaded');
              // Add additional delay before enabling controls to ensure extensions are fully initialized
              setTimeout(() => {
                this.enableViewerControls();
              }, 300);
            })
            .catch((error: any) => {
              console.warn('⚠️ Some extensions failed to load:', error);
              // Still enable controls even if some extensions fail
              setTimeout(() => {
                this.enableViewerControls();
              }, 300);
            });
        }, 1000); // Increased delay to ensure viewer is fully ready

        // Wait for viewer to be fully initialized before registering tools
        this.viewer.addEventListener(Autodesk.Viewing.VIEWER_INITIALIZED, () => {
          console.log('Viewer fully initialized event received');

          // Register custom tool after viewer is fully ready
          console.log('Registering custom tool...');
          this.threeJsToolService.registerTool(this.viewer);

          console.log('Viewer initialization complete');
          console.log('Available extensions:', this.viewer.getExtensionIds());
        });

        // Also handle the case where the viewer might already be initialized
        if (this.viewer.model) {
          console.log('Viewer already has model loaded, registering tools immediately');
          this.threeJsToolService.registerTool(this.viewer);
        }

        console.log('Viewer object:', this.viewer);
        console.log('Viewer container dimensions:', {
          width: container.clientWidth,
          height: container.clientHeight
        });

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
      // First, get an access token from our backend
      console.log('Getting Forge access token...');
      const tokenResponse = await this.forgeService.getAccessToken();
      console.log('Token obtained successfully');
      console.log('Token details:', {
        token_type: tokenResponse.token_type,
        expires_in: tokenResponse.expires_in,
        token_preview: tokenResponse.access_token.substring(0, 20) + '...'
      });

      // Try different approaches for demo models
      const demoUrns = [
        // Note: These are example URNs - replace with actual URNs from your Forge account
        // For working demo models, you would need to:
        // 1. Upload a model to your own bucket using the Data Management API
        // 2. Translate the model using the Model Derivative API  
        // 3. Use the resulting URN here
        'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bXktYnVja2V0L215LWF3ZXNvbWUtZm9yZ2UtZmlsZS5ydnQ'
      ];

      console.log('Attempting to load demo models...');
      console.log('Note: Demo models may fail as they require actual URNs from your Forge account');

      // Instead of trying potentially invalid URNs, inform the user and load simple geometry
      console.log('⚠️ External model loading requires valid URNs from your Forge account');
      console.log('🔄 Loading simple geometry instead to demonstrate viewer functionality...');

      this.loading = false;
      this.cdr.detectChanges();

      // Load simple geometry to demonstrate the viewer works
      setTimeout(() => {
        this.loadSimpleGeometry();
      }, 1000);

    } catch (error) {
      console.error('Error in loadSampleModel:', error);
      this.loading = false;
      this.cdr.detectChanges();

      // Fallback to simple geometry on any error
      setTimeout(() => {
        this.loadSimpleGeometry();
      }, 1000);
    }
  }

  loadSimpleGeometry(): void {
    if (!this.viewer) return;

    this.loading = true;
    this.cdr.detectChanges();

    try {
      // Clear any existing models first
      this.viewer.unloadModel();

      // Try to get Forge Viewer's internal THREE.js, fallback to imported THREE
      let ThreeJS = null;

      // Check multiple possible paths for Forge's THREE.js
      if ((window as any).Autodesk?.Viewing?.Private?.THREE) {
        ThreeJS = (window as any).Autodesk.Viewing.Private.THREE;
        console.log('Using Forge Viewer internal THREE.js');
      } else if ((window as any).THREE) {
        ThreeJS = (window as any).THREE;
        console.log('Using global THREE.js');
      } else {
        ThreeJS = THREE; // Fallback to imported THREE
        console.log('Using imported THREE.js as fallback');
      }

      if (!ThreeJS) {
        throw new Error('THREE.js library not available');
      }

      // Create a simple scene with multiple objects to demonstrate the viewer
      const objects: any[] = [];

      // Create a cube
      const cubeGeometry = new ThreeJS.BoxGeometry(50, 50, 50);
      const cubeMaterial = new ThreeJS.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: false
      });
      const cube = new ThreeJS.Mesh(cubeGeometry, cubeMaterial);
      cube.position.set(0, 0, 0);
      objects.push(cube);

      // Create a sphere
      const sphereGeometry = new ThreeJS.SphereGeometry(30, 32, 32);
      const sphereMaterial = new ThreeJS.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: false
      });
      const sphere = new ThreeJS.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.set(100, 0, 0);
      objects.push(sphere);

      // Create a cylinder
      const cylinderGeometry = new ThreeJS.CylinderGeometry(20, 20, 80, 32);
      const cylinderMaterial = new ThreeJS.MeshBasicMaterial({
        color: 0x0000ff,
        wireframe: false
      });
      const cylinder = new ThreeJS.Mesh(cylinderGeometry, cylinderMaterial);
      cylinder.position.set(-100, 0, 0);
      objects.push(cylinder);

      // Add to viewer overlay scene using the correct method
      if (this.viewer.impl) {
        const overlayName = 'simple-geometry-overlay';

        // Create overlay scene if it doesn't exist
        if (!this.viewer.impl.overlayScenes[overlayName]) {
          this.viewer.impl.createOverlayScene(overlayName);
        }

        // Get the overlay scene
        const overlayScene = this.viewer.impl.overlayScenes[overlayName].scene;
        if (overlayScene) {
          // Add all objects to the overlay scene
          objects.forEach(obj => overlayScene.add(obj));

          // Calculate bounding box for all objects
          const bbox = new ThreeJS.Box3();

          // Use setFromObject or manually expand the bbox for each object
          objects.forEach(obj => {
            if (bbox.setFromObject) {
              // If setFromObject is available, use it on the first object and expand with others
              if (bbox.isEmpty()) {
                bbox.setFromObject(obj);
              } else {
                const objBbox = new ThreeJS.Box3().setFromObject(obj);
                bbox.union(objBbox);
              }
            } else if (bbox.expandByObject) {
              // Fallback to expandByObject if available
              bbox.expandByObject(obj);
            } else {
              // Manual bounding box calculation as last resort
              obj.geometry.computeBoundingBox();
              const objBbox = obj.geometry.boundingBox.clone();
              objBbox.applyMatrix4(obj.matrixWorld);
              if (bbox.isEmpty()) {
                bbox.copy(objBbox);
              } else {
                bbox.union(objBbox);
              }
            }
          });

          // Fit camera to show all objects
          this.viewer.navigation.fitBounds(false, bbox);

          // Force refresh with all render modes
          this.viewer.impl.invalidate(true, true, true);

          // Enable all viewer controls after loading geometry
          setTimeout(() => {
            this.enableViewerControls();
          }, 500);

          console.log('Simple geometry scene loaded successfully');
          console.log('Used THREE.js from:',
            ThreeJS === (window as any).Autodesk?.Viewing?.Private?.THREE ? 'Forge Internal' :
              ThreeJS === (window as any).THREE ? 'Global Window' : 'Imported Module'
          );
          console.log('Objects added:', objects.length);
        }
      }

      this.loading = false;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading simple geometry:', error);
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  loadTestModel(): void {
    if (!this.viewer) return;

    this.loading = true;
    this.cdr.detectChanges();

    try {
      // Clear any existing models
      this.viewer.unloadModel();

      // Try to get Forge Viewer's internal THREE.js, fallback to imported THREE
      let ThreeJS = null;

      if ((window as any).Autodesk?.Viewing?.Private?.THREE) {
        ThreeJS = (window as any).Autodesk.Viewing.Private.THREE;
        console.log('Using Forge Viewer internal THREE.js for test model');
      } else if ((window as any).THREE) {
        ThreeJS = (window as any).THREE;
        console.log('Using global THREE.js for test model');
      } else {
        ThreeJS = THREE; // Fallback to imported THREE
        console.log('Using imported THREE.js as fallback for test model');
      }

      if (!ThreeJS) {
        throw new Error('THREE.js library not available');
      }

      // Create overlay scene for our custom geometries
      const overlayName = 'test-model-overlay';
      if (!this.viewer.impl.overlayScenes[overlayName]) {
        this.viewer.impl.createOverlayScene(overlayName);
      }

      const overlayScene = this.viewer.impl.overlayScenes[overlayName].scene;

      if (overlayScene) {
        // Create cube
        const cubeGeometry = new ThreeJS.BoxGeometry(50, 50, 50);
        const cubeMaterial = new ThreeJS.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new ThreeJS.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(-75, 0, 0);

        // Create sphere
        const sphereGeometry = new ThreeJS.SphereGeometry(25, 32, 32);
        const sphereMaterial = new ThreeJS.MeshBasicMaterial({ color: 0xff0000 });
        const sphere = new ThreeJS.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(0, 0, 0);

        // Create cylinder
        const cylinderGeometry = new ThreeJS.CylinderGeometry(20, 20, 60, 32);
        const cylinderMaterial = new ThreeJS.MeshBasicMaterial({ color: 0x0000ff });
        const cylinder = new ThreeJS.Mesh(cylinderGeometry, cylinderMaterial);
        cylinder.position.set(75, 0, 0);

        // Add geometries to overlay scene
        overlayScene.add(cube);
        overlayScene.add(sphere);
        overlayScene.add(cylinder);

        // Create bounding box for all objects and fit camera - use same THREE.js instance
        const bbox = new ThreeJS.Box3();
        const geometries = [cube, sphere, cylinder];

        // Use setFromObject or manually expand the bbox for each object
        geometries.forEach(obj => {
          if (bbox.setFromObject) {
            // If setFromObject is available, use it on the first object and expand with others
            if (bbox.isEmpty()) {
              bbox.setFromObject(obj);
            } else {
              const objBbox = new ThreeJS.Box3().setFromObject(obj);
              bbox.union(objBbox);
            }
          } else if (bbox.expandByObject) {
            // Fallback to expandByObject if available
            bbox.expandByObject(obj);
          } else {
            // Manual bounding box calculation as last resort
            obj.geometry.computeBoundingBox();
            const objBbox = obj.geometry.boundingBox.clone();
            objBbox.applyMatrix4(obj.matrixWorld);
            if (bbox.isEmpty()) {
              bbox.copy(objBbox);
            } else {
              bbox.union(objBbox);
            }
          }
        });

        this.viewer.navigation.fitBounds(false, bbox);
        this.viewer.impl.invalidate(true, true, true);

        // Enable all viewer controls after loading geometry
        setTimeout(() => {
          this.enableViewerControls();
        }, 500);

        console.log('Test model with multiple geometries loaded successfully');
      }

      this.loading = false;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading test model:', error);
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  /**
   * Load a custom URN provided by the user
   */
  async loadCustomUrn(): Promise<void> {
    const urn = prompt('Enter the URN (without the "urn:" prefix):');
    if (!urn || urn.trim() === '') {
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();

    try {
      console.log('Loading custom URN:', urn);
      await utils.loadModel(this.viewer, urn.trim());
      // await this.loadModelByUrn(urn.trim());
      console.log('✅ Successfully loaded custom model');
      this.loading = false;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('❌ Failed to load custom URN:', error);
      alert(`Failed to load model with URN: ${urn}\n\nError: ${error}\n\nPlease check that the URN is valid and the model exists.`);
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

  onModelChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const urn = select.value;

    if (!urn) return;

    console.log('Model selection changed:', urn);

    switch (urn) {
      case 'simple-geometry':
        this.loadSimpleGeometry();
        break;
      case 'custom-urn':
        this.loadCustomUrn();
        break;
      case 'test-model':
        this.loadTestModel();
        break;
      default:
        console.warn('Unknown model URN:', urn);
    }
  }

  private enableViewerControls(): void {
    if (!this.viewer) return;

    try {
      console.log('🔧 Setting up viewer controls...');

      // Check if viewer is properly initialized
      if (!this.viewer.impl || !this.viewer.impl.scene) {
        console.log('Viewer not fully initialized yet, retrying in 500ms...');
        setTimeout(() => {
          this.enableViewerControls();
        }, 500);
        return;
      }

      // Log viewer and toolbar state
      console.log('📊 Viewer state information:');
      console.log('  - Viewer container:', this.viewer.container);
      console.log('  - Viewer toolbar:', this.viewer.toolbar);
      console.log('  - Toolbar container:', this.viewer.toolbar?.container);

      // Check loaded extensions using alternative method
      try {
        const extensionManager = this.viewer.extensionManager;
        if (extensionManager && extensionManager.loadedExtensions) {
          const loadedExtensions = Object.keys(extensionManager.loadedExtensions);
          console.log('  - Loaded extensions:', loadedExtensions);
        } else {
          console.log('  - Extension manager not available or extensions list not accessible');
        }
      } catch (extError) {
        console.warn('Could not get loaded extensions:', extError);
      }

      // Check for built-in toolbar (GuiViewer3D should have this)
      if (this.viewer.toolbar) {
        console.log('✅ Built-in toolbar found');
        console.log('  - Toolbar visible:', this.viewer.toolbar.isVisible());
        console.log('  - Toolbar controls:', this.viewer.toolbar.getNumberOfControls());

        // Ensure toolbar is visible
        this.viewer.toolbar.setVisible(true);
        console.log('✅ Toolbar visibility ensured');

        // Add some default controls to the existing toolbar if they don't exist
        try {
          // Try to add home button if not present
          if (this.viewer.toolbar.getControl && !this.viewer.toolbar.getControl('toolbar-homeButton')) {
            const homeButton = new Autodesk.Viewing.UI.Button('toolbar-homeButton');
            homeButton.setIcon('adsk-icon-home');
            homeButton.setToolTip('Home View');
            homeButton.onClick = () => {
              this.viewer.navigation.setRequestHomeView(true);
            };
            this.viewer.toolbar.addControl(homeButton);
            console.log('✅ Added Home button to existing toolbar');
          }

          // Try to add fit to view button if not present
          if (this.viewer.toolbar.getControl && !this.viewer.toolbar.getControl('toolbar-fitButton')) {
            const fitButton = new Autodesk.Viewing.UI.Button('toolbar-fitButton');
            fitButton.setIcon('adsk-icon-fit-to-view');
            fitButton.setToolTip('Fit to View');
            fitButton.onClick = () => {
              this.viewer.fitToView();
            };
            this.viewer.toolbar.addControl(fitButton);
            console.log('✅ Added Fit to View button to existing toolbar');
          }

          // Load Model Selector Extension
          this.loadModelSelectorExtension();

          // Add custom lighting button (equivalent to the example's button creation)
          this.addCustomLightingButton();
        } catch (controlError) {
          console.warn('Could not add controls to existing toolbar:', controlError);
        }
      } else {
        console.log('❌ No built-in toolbar available');

        // Try to initialize the toolbar manually only if we have a model loaded
        try {
          // Check if we have a model loaded before trying createUI
          if (this.viewer.model && this.viewer.createUI && typeof this.viewer.createUI === 'function') {
            console.log('🔄 Attempting to create UI manually (model is loaded)...');
            this.viewer.createUI();

            // Check again after UI creation
            if (this.viewer.toolbar) {
              console.log('✅ Toolbar created successfully via createUI()');
              this.viewer.toolbar.setVisible(true);
            } else {
              console.log('❌ Toolbar still not available after createUI()');
              // Try creating a basic manual toolbar as last resort
              this.createBasicToolbar();
            }
          } else {
            console.log('🔄 No model loaded or createUI not available, creating basic toolbar directly...');
            // Create basic toolbar immediately when no model is loaded
            this.createBasicToolbar();
          }
        } catch (uiError) {
          console.warn('Failed to create UI manually:', uiError);
          // Fallback to basic toolbar
          console.log('🔄 Creating fallback basic toolbar due to error...');
          this.createBasicToolbar();
        }
      }

      // Check for ViewCube
      try {
        const viewCubeExtension = this.viewer.getExtension && this.viewer.getExtension('Autodesk.ViewCubeUi');
        if (viewCubeExtension) {
          console.log('✅ ViewCube extension is available and loaded');
          console.log('  - ViewCube extension:', viewCubeExtension);
        } else {
          console.log('❌ ViewCube extension not found');
        }
      } catch (vcError) {
        console.warn('Error checking ViewCube extension:', vcError);
      }

      // Enable basic navigation context menu (with error handling)
      try {
        if (this.viewer.setContextMenu && typeof this.viewer.setContextMenu === 'function') {
          // Only enable if context menu is properly available
          if (this.viewer.contextMenu && this.viewer.contextMenu.hide) {
            this.viewer.setContextMenu(true);
            console.log('✅ Navigation context menu enabled');
          } else {
            console.log('ℹ️ Context menu not fully available, skipping');
          }
        }
      } catch (contextError) {
        console.warn('Context menu setup failed:', contextError);
      }

      // Try to enable additional built-in UI components if available
      try {
        // Check if there are any built-in UI preferences we can enable
        if (this.viewer.prefs) {
          // Enable any default UI preferences
          this.viewer.prefs.set('ghosting', true);
          this.viewer.prefs.set('ambientShadows', true);
          console.log('✅ Basic viewer preferences configured');
        }
      } catch (prefsError) {
        console.warn('Preferences setup failed:', prefsError);
      }

      console.log('✅ Viewer controls setup completed');

      // Final step: Force toolbar and UI visibility check
      this.forceUIVisibility();

      console.log('🎮 Available navigation controls:');
      console.log('  - Orbit: Left mouse button + drag');
      console.log('  - Pan: Middle mouse button or Shift + Left mouse drag');
      console.log('  - Zoom: Mouse wheel or Right mouse drag');
      console.log('  - ViewCube: Should appear in top-right corner');
      console.log('  - Toolbar: Should appear at the top of the viewer');
      console.log('  - Context Menu: Right-click for navigation options');

    } catch (error) {
      console.error('❌ Error setting up viewer controls:', error);
    }
  }

  /**
   * Manually create a basic toolbar if one doesn't exist
   */
  private createBasicToolbar(): boolean {
    try {
      const viewerContainer = this.viewer.container;
      if (!viewerContainer) {
        console.warn('No viewer container found for toolbar creation');
        return false;
      }

      // Check if toolbar already exists
      let existingToolbar = viewerContainer.querySelector('.adsk-viewing-viewer-toolbar, .toolbar');
      if (existingToolbar) {
        console.log('✅ Toolbar already exists in DOM');
        return true;
      }

      // Create a basic toolbar element
      const toolbar = document.createElement('div');
      toolbar.className = 'adsk-viewing-viewer-toolbar custom-toolbar';
      toolbar.style.cssText = `
        position: absolute; 
        top: 0; 
        left: 0; 
        right: 0; 
        height: 40px; 
        background: rgba(0,0,0,0.8); 
        z-index: 1000; 
        display: flex; 
        align-items: center; 
        padding: 0 10px;
        font-family: Arial, sans-serif;
        border-bottom: 1px solid #444;
      `;

      // Create button style
      const buttonStyle = `
        background: rgba(255,255,255,0.1); 
        border: 1px solid #666; 
        color: white; 
        padding: 6px 12px; 
        margin-right: 8px; 
        cursor: pointer; 
        border-radius: 3px;
        font-size: 12px;
        transition: background-color 0.2s;
      `;

      const buttonHoverStyle = `
        background: rgba(255,255,255,0.2);
      `;

      // Home button
      const homeButton = document.createElement('button');
      homeButton.innerHTML = '🏠';
      homeButton.title = 'Home View';
      homeButton.style.cssText = buttonStyle;
      homeButton.onmouseover = () => homeButton.style.background = 'rgba(255,255,255,0.2)';
      homeButton.onmouseout = () => homeButton.style.background = 'rgba(255,255,255,0.1)';
      homeButton.onclick = () => {
        try {
          if (this.viewer && this.viewer.navigation) {
            this.viewer.navigation.setRequestHomeView(true);
            console.log('🏠 Home view activated');
          }
        } catch (e) {
          console.warn('Home view failed:', e);
        }
      };

      // Fit to view button
      const fitButton = document.createElement('button');
      fitButton.innerHTML = '🔍';
      fitButton.title = 'Fit to View';
      fitButton.style.cssText = buttonStyle;
      fitButton.onmouseover = () => fitButton.style.background = 'rgba(255,255,255,0.2)';
      fitButton.onmouseout = () => fitButton.style.background = 'rgba(255,255,255,0.1)';
      fitButton.onclick = () => {
        try {
          // Try multiple methods for fit to view
          if (this.viewer && this.viewer.fitToView) {
            this.viewer.fitToView();
            console.log('🔍 Fit to view (method 1) activated');
          } else if (this.viewer && this.viewer.navigation && this.viewer.navigation.fitBounds) {
            this.viewer.navigation.fitBounds(true);
            console.log('🔍 Fit to view (method 2) activated');
          } else if (this.viewer && this.viewer.autocam && this.viewer.autocam.setRequestFitToView) {
            this.viewer.autocam.setRequestFitToView(true);
            console.log('🔍 Fit to view (method 3) activated');
          } else {
            console.warn('🔍 No fit to view method available');
          }
        } catch (e) {
          console.warn('Fit to view failed:', e);
        }
      };

      // Reset view button
      const resetButton = document.createElement('button');
      resetButton.innerHTML = '🔄';
      resetButton.title = 'Reset View';
      resetButton.style.cssText = buttonStyle;
      resetButton.onmouseover = () => resetButton.style.background = 'rgba(255,255,255,0.2)';
      resetButton.onmouseout = () => resetButton.style.background = 'rgba(255,255,255,0.1)';
      resetButton.onclick = () => {
        try {
          if (this.viewer && this.viewer.navigation) {
            // Reset to home view and fit bounds
            this.viewer.navigation.setRequestHomeView(true);
            setTimeout(() => {
              if (this.viewer.navigation.fitBounds) {
                this.viewer.navigation.fitBounds(true);
              }
            }, 100);
            console.log('🔄 Reset view activated');
          }
        } catch (e) {
          console.warn('Reset view failed:', e);
        }
      };

      // Pan/Orbit mode toggle button (simplified)
      const panButton = document.createElement('button');
      panButton.innerHTML = '🎯';
      panButton.title = 'Focus View';
      panButton.style.cssText = buttonStyle;
      panButton.onmouseover = () => panButton.style.background = 'rgba(255,255,255,0.2)';
      panButton.onmouseout = () => panButton.style.background = 'rgba(255,255,255,0.1)';
      panButton.onclick = () => {
        try {
          // Simple focus view action that should work consistently
          if (this.viewer && this.viewer.navigation) {
            this.viewer.navigation.setRequestHomeView(true);
            setTimeout(() => {
              if (this.viewer.navigation.fitBounds) {
                this.viewer.navigation.fitBounds(true);
              }
            }, 100);
            console.log('🎯 Focus view activated');
          }
        } catch (e) {
          console.warn('Focus view failed:', e);
        }
      };

      // Settings button (debugging and info)
      const settingsButton = document.createElement('button');
      settingsButton.innerHTML = '⚙️';
      settingsButton.title = 'Debug Info';
      settingsButton.style.cssText = buttonStyle;
      settingsButton.onmouseover = () => settingsButton.style.background = 'rgba(255,255,255,0.2)';
      settingsButton.onmouseout = () => settingsButton.style.background = 'rgba(255,255,255,0.1)';
      settingsButton.onclick = () => {
        console.log('=== FORGE VIEWER DEBUG INFO ===');
        console.log('Viewer object:', this.viewer);
        console.log('Navigation methods:', this.viewer.navigation ? Object.getOwnPropertyNames(this.viewer.navigation) : 'No navigation');
        console.log('Autocam methods:', this.viewer.autocam ? Object.getOwnPropertyNames(this.viewer.autocam) : 'No autocam');
        console.log('Toolbar:', this.viewer.toolbar);
        console.log('Current view state:', this.viewer.getState ? this.viewer.getState() : 'No getState method');
        console.log('Extensions loaded:', this.viewer.getLoadedExtensions ? this.viewer.getLoadedExtensions() : 'No extension info');
        console.log('=== END DEBUG INFO ===');
      };

      // Add label
      const label = document.createElement('span');
      label.textContent = 'Forge Viewer';
      label.style.cssText = `
        color: white; 
        font-size: 12px; 
        margin-left: auto; 
        margin-right: 10px;
        opacity: 0.7;
      `;

      // Add buttons to toolbar
      toolbar.appendChild(homeButton);
      toolbar.appendChild(fitButton);
      toolbar.appendChild(resetButton);
      toolbar.appendChild(panButton);
      toolbar.appendChild(settingsButton);
      toolbar.appendChild(label);

      // Insert toolbar at the beginning of viewer container
      viewerContainer.insertBefore(toolbar, viewerContainer.firstChild);

      console.log('✅ Enhanced basic toolbar manually created with controls');
      return true;

    } catch (error) {
      console.error('❌ Failed to create basic toolbar:', error);
      return false;
    }
  }

  /**
   * Load extensions sequentially to avoid conflicts
   */
  private async loadExtensionsSequentially(extensions: string[]): Promise<void> {
    for (const extensionId of extensions) {
      try {
        console.log(`🔄 Loading ${extensionId}...`);

        // Special handling for NavTools which requires configuration
        if (extensionId === 'Autodesk.DefaultTools.NavTools') {
          const navToolsConfig = {
            showPanTool: true,
            showOrbitTool: true,
            showZoomTool: true,
            showFocalLengthTool: false,
            showRollTool: false
          };
          await this.viewer.loadExtension(extensionId, navToolsConfig);
        } else {
          await this.viewer.loadExtension(extensionId);
        }

        console.log(`✅ ${extensionId} loaded successfully`);
      } catch (error: any) {
        console.warn(`⚠️ ${extensionId} failed to load:`, error.message || error);
        // Continue with next extension even if this one fails
      }
    }
  }

  /**
   * Force UI visibility as a final check
   */
  private forceUIVisibility(): void {
    try {
      console.log('🔍 Final UI visibility check...');

      // Force toolbar visibility if it exists
      if (this.viewer.toolbar) {
        this.viewer.toolbar.setVisible(true);
        console.log('✅ Toolbar visibility forced');
      }

      // Force ViewCube visibility if available
      const viewCubeExt = this.viewer.getExtension && this.viewer.getExtension('Autodesk.ViewCubeUi');
      if (viewCubeExt && viewCubeExt.setVisible) {
        viewCubeExt.setVisible(true);
        console.log('✅ ViewCube visibility forced');
      }

      // Ensure navigation tools are enabled
      const navToolsExt = this.viewer.getExtension && this.viewer.getExtension('Autodesk.DefaultTools.NavTools');
      if (navToolsExt) {
        console.log('✅ NavTools extension confirmed active');
      }

      // Force UI invalidation to refresh display
      if (this.viewer.impl && this.viewer.impl.invalidate) {
        this.viewer.impl.invalidate(true, true, true);
        console.log('✅ Viewer display invalidated for refresh');
      }

      // Double-check toolbar DOM presence
      const viewerContainer = this.viewer.container;
      if (viewerContainer) {
        const toolbarElements = viewerContainer.querySelectorAll('.adsk-viewing-viewer-toolbar, .toolbar, .custom-toolbar');
        console.log(`📊 Found ${toolbarElements.length} toolbar element(s) in DOM`);

        // Make sure all toolbar elements are visible
        toolbarElements.forEach((toolbar: any, index: number) => {
          if (toolbar.style) {
            toolbar.style.display = 'flex';
            toolbar.style.visibility = 'visible';
            console.log(`✅ Toolbar ${index + 1} display forced`);
          }
        });
      }

    } catch (error) {
      console.warn('⚠️ Error during UI visibility check:', error);
    }
  }

  private loadModelSelectorExtension(): void {
    try {
      console.log('🔧 Loading Model Selector Extension...');

      if (this.modelSelectorExtension) {
        console.log('Model Selector Extension already loaded');
        return;
      }

      // Create and load the model selector extension with this component as parent
      this.modelSelectorExtension = new ModelSelectorExtension(this.viewer, this);
      this.modelSelectorExtension.load();

      console.log('✅ Model Selector Extension loaded successfully');
    } catch (error) {
      console.error('❌ Error loading Model Selector Extension:', error);
    }
  }

  /**
   * Public method to load a model by URN - used by the model selector extension
   * @param urn The URN of the model to load
   */
  public async loadModelByUrn(urn: string): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('🔄 Loading model with URN:', urn);

      const onDocumentLoadSuccess = (doc: any) => {
        console.log('✅ Document loaded successfully:', doc);
        try {
          const viewable = doc.getRoot().getDefaultGeometry();
          if (viewable) {
            this.viewer.loadDocumentNode(doc, viewable).then(() => {
              console.log('✅ Model loaded successfully in viewer');

              // Fit the model to view
              setTimeout(() => {
                this.viewer.fitToView();
              }, 1000);

              resolve();
            }).catch((error: any) => {
              console.error('❌ Error loading document node:', error);
              reject(error);
            });
          } else {
            const error = new Error('No viewable geometry found in document');
            console.error('❌', error.message);
            reject(error);
          }
        } catch (error) {
          console.error('❌ Error processing document:', error);
          reject(error);
        }
      };

      const onDocumentLoadFailure = (viewerErrorCode: any, viewerErrorMsg: any) => {
        const error = new Error(`Failed to load document: ${viewerErrorMsg} (Code: ${viewerErrorCode})`);
        console.error('❌', error.message);
        reject(error);
      };

      // Ensure URN has proper format
      const formattedUrn = urn.startsWith('urn:') ? urn : `urn:${urn}`;

      // Load the document with the URN
      Autodesk.Viewing.Document.load(formattedUrn, onDocumentLoadSuccess, onDocumentLoadFailure);
    });
  }

  /**
   * Add custom lighting button to toolbar (similar to the example provided)
   */
  private addCustomLightingButton(): void {
    if (!this.viewer || !this.viewer.toolbar) {
      console.warn('Cannot add lighting button: viewer or toolbar not available');
      return;
    }

    try {
      // Create the lighting button (equivalent to the "my-button" in the example)
      const lightButton = new Autodesk.Viewing.UI.Button('lighting-button');
      lightButton.setIcon('adsk-icon-lighting');
      lightButton.setToolTip('Change Lighting (Preset 16)');

      // Set the onClick handler (equivalent to the example's onClick function)
      lightButton.onClick = () => {
        console.log('🌟 Changing lighting to preset 16');
        this.viewer.setLightPreset(16);
      };

      // Add CSS class for styling (equivalent to the example's addClass)
      lightButton.addClass('custom-lighting-button');

      // Create control group and add button
      const lightingGroup = new Autodesk.Viewing.UI.ControlGroup('lighting-group');
      lightingGroup.addControl(lightButton);

      // Add to toolbar
      this.viewer.toolbar.addControl(lightingGroup);

      console.log('✅ Custom lighting button added to toolbar');
    } catch (error) {
      console.error('❌ Error adding lighting button:', error);
    }
  }

  // Method to refresh the model list (can be called externally if needed)
  public refreshModelList(): void {
    if (this.modelSelectorExtension) {
      // For the new extension, we don't need to refresh since it uses static demo models
      console.log('Demo models selector uses static models - no refresh needed');
    }
  }
}

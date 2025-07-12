import { Injectable } from '@angular/core';
import * as THREE from 'three';

declare const Autodesk: any;

@Injectable({
  providedIn: 'root'
})
export class ThreeJsToolService {
  private viewer: any;
  private overlayScene: THREE.Scene | null = null;
  private annotations: THREE.Group = new THREE.Group();

  constructor() {}

  registerTool(viewer: any): void {
    this.viewer = viewer;
    
    // Check if toolController is available
    if (!viewer.toolController) {
      console.error('ToolController not available on viewer');
      return;
    }
    
    // Create the custom tool constructor function
    const ThreeJsAnnotationTool = function(this: any) {
      const self = this;
      self.names = ['ThreeJsAnnotationTool'];
      self.active = false;
      
      // Required method by Forge Viewer
      self.getNames = function() {
        return self.names;
      };
      
      // Tool activation
      self.activate = function() {
        console.log('ThreeJS Annotation Tool activated');
        self.active = true;
      };
      
      // Tool deactivation
      self.deactivate = function() {
        console.log('ThreeJS Annotation Tool deactivated');
        self.active = false;
      };
      
      // Handle mouse events
      self.handleSingleClick = function(event: any) {
        if (!self.active) return false;
        
        const result = viewer.impl.hitTest(event.canvasX, event.canvasY, true);
        if (result) {
          self.addAnnotation(result.intersectPoint);
        }
        
        return true;
      };
      
      // Add annotation at clicked point
      self.addAnnotation = function(point: any) {
        const service = (window as any).threeJsToolService;
        if (service) {
          service.createAnnotation(point);
        }
      };
    };
    
    // Store reference to this service in window for tool access
    (window as any).threeJsToolService = this;
    
    // Register the tool with proper error handling
    try {
      const threeJsAnnotationToolInstance = new (ThreeJsAnnotationTool as any)();
      viewer.toolController.registerTool(threeJsAnnotationToolInstance);
      console.log('ThreeJS Annotation Tool registered successfully');
    } catch (error) {
      console.error('Failed to register ThreeJS Annotation Tool:', error);
    }
    
    // Initialize overlay scene
    this.initializeOverlay();
  }

  private initializeOverlay(): void {
    if (!this.viewer) return;

    try {
      // Create overlay scene
      this.viewer.impl.createOverlayScene('ThreeJsAnnotations');
      
      // Get the overlay scene
      const overlayData = this.viewer.impl.overlayScenes['ThreeJsAnnotations'];
      if (overlayData && overlayData.scene) {
        this.overlayScene = overlayData.scene;
        
        // Don't add the annotations group directly to overlay scene
        // Instead, we'll add individual annotations to the group
        // and then add them to the overlay scene when needed
        console.log('Overlay scene initialized successfully');
      } else {
        console.error('Failed to get overlay scene');
      }
    } catch (error) {
      console.error('Error initializing overlay:', error);
    }
  }

  createAnnotation(point: THREE.Vector3): void {
    if (!this.overlayScene) {
      console.error('Overlay scene not available');
      return;
    }

    try {
      // Use Forge Viewer's internal THREE.js to avoid conflicts
      const THREE = (window as any).Autodesk.Viewing.Private.THREE;
      
      // Create annotation sphere using Forge's THREE.js
      const geometry = new THREE.SphereGeometry(5, 32, 32);
      const material = new THREE.MeshBasicMaterial({ 
        color: 0xff0000,
        transparent: true,
        opacity: 0.8
      });
      const sphere = new THREE.Mesh(geometry, material);
      
      // Position at clicked point
      sphere.position.copy(point);
      
      // Add to annotations group for tracking
      this.annotations.add(sphere);
      
      // Add directly to overlay scene
      this.overlayScene.add(sphere);
      
      // Create label
      this.createLabel(point, `Annotation ${this.annotations.children.length}`);
      
      // Refresh viewer
      this.viewer.impl.invalidate(true);
      
      // Save annotation to backend
      this.saveAnnotation(point);
      
      console.log('Annotation created successfully at:', point);
    } catch (error) {
      console.error('Error creating annotation:', error);
    }
  }

  private createLabel(position: THREE.Vector3, text: string): void {
    // In a real implementation, you would create a 2D label
    // that follows the 3D position
    console.log(`Created label "${text}" at position:`, position);
  }

  private saveAnnotation(position: THREE.Vector3): void {
    // Here you would save the annotation to your GraphQL backend
    const annotationData = {
      position: {
        x: position.x,
        y: position.y,
        z: position.z
      },
      timestamp: new Date().toISOString(),
      type: 'point'
    };
    
    console.log('Saving annotation:', annotationData);
    // TODO: Implement GraphQL mutation to save annotation
  }

  clearAnnotations(): void {
    // Remove all children from annotations group and overlay scene
    while (this.annotations.children.length > 0) {
      const child = this.annotations.children[0];
      
      // Remove from annotations group
      this.annotations.remove(child);
      
      // Remove from overlay scene if it exists
      if (this.overlayScene) {
        this.overlayScene.remove(child);
      }
      
      // Dispose of geometries and materials
      if ((child as THREE.Mesh).geometry) {
        (child as THREE.Mesh).geometry.dispose();
      }
      if ((child as THREE.Mesh).material) {
        const material = (child as THREE.Mesh).material;
        if (Array.isArray(material)) {
          material.forEach(m => m.dispose());
        } else {
          material.dispose();
        }
      }
    }
    
    // Refresh viewer
    if (this.viewer) {
      this.viewer.impl.invalidate(true);
    }
    
    console.log('All annotations cleared');
  }

  getAnnotations(): any[] {
    // Return current annotations
    return this.annotations.children.map((child, index) => ({
      id: index,
      position: child.position,
      type: 'point'
    }));
  }
}

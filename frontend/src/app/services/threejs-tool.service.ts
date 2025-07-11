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
    
    // Create the custom tool
    const ThreeJsAnnotationTool = function(this: any) {
      const self = this;
      self.names = ['ThreeJsAnnotationTool'];
      
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
    
    // Register the tool
    viewer.toolController.registerTool(ThreeJsAnnotationTool);
    
    // Initialize overlay scene
    this.initializeOverlay();
  }

  private initializeOverlay(): void {
    if (!this.viewer) return;

    // Create overlay scene
    this.viewer.impl.createOverlayScene('ThreeJsAnnotations');
    this.overlayScene = this.viewer.impl.overlayScenes['ThreeJsAnnotations'].scene;
    
    // Add annotations group to overlay
    if (this.overlayScene) {
      this.overlayScene.add(this.annotations);
    }
  }

  createAnnotation(point: THREE.Vector3): void {
    if (!this.overlayScene) return;

    // Create annotation sphere
    const geometry = new THREE.SphereGeometry(5, 32, 32);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0xff0000,
      transparent: true,
      opacity: 0.8
    });
    const sphere = new THREE.Mesh(geometry, material);
    
    // Position at clicked point
    sphere.position.copy(point);
    
    // Add to annotations group
    this.annotations.add(sphere);
    
    // Create label
    this.createLabel(point, `Annotation ${this.annotations.children.length}`);
    
    // Refresh viewer
    this.viewer.impl.invalidate(true);
    
    // Save annotation to backend
    this.saveAnnotation(point);
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
    // Remove all children from annotations group
    while (this.annotations.children.length > 0) {
      const child = this.annotations.children[0];
      this.annotations.remove(child);
      
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

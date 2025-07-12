declare const Autodesk: any;

export interface DemoModel {
  urn: string;
  name: string;
  description?: string;
}

export class ModelSelectorExtension {
  private viewer: any;
  private dropdown: HTMLSelectElement | null = null;
  private group: any;
  private parentComponent: any;

  // Lista de modelos de demostración basada en modelos públicos conocidos de Autodesk
  private demoModels: DemoModel[] = [
    {
      name: '01_spaceship.f3d',
      urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YXBzLWNvZGVwZW4tYmFja2VuZC8wNV9zcGFjZXNoaXAuZjNk',
      description: 'Autodesk demo of a spaceship model'
    },
    {
      name: '02_drive_roller_assembly.dwg',
      urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YXBzLWNvZGVwZW4tYmFja2VuZC8wM19kcml2ZV9yb2xsZXJfYXNzZW1ibHkuZHdn',
      description: 'Drive roller assembly example'
    },
    {
      name: '03_jet_engine_model.zip',
      urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YXBzLWNvZGVwZW4tYmFja2VuZC8wMl9qZXRfZW5naW5lX21vZGVsLnppcA',
      description: 'Jet engine model example'
    },
    {
      name: '04_bike_frame.f3d',
      urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YXBzLWNvZGVwZW4tYmFja2VuZC8wNF9iaWtlX2ZyYW1lLmYzZA',
      description: 'Bike frame model example'
    },
    {
      name: '05_rac_basic_sample_project.rvt',
      urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YXBzLWNvZGVwZW4tYmFja2VuZC8wMV9yYWNfYmFzaWNfc2FtcGxlX3Byb2plY3QucnZ0',
      description: 'RAC Basic Sample Project'
    },
    {
      urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Zm9yZ2V0aXQtYnVja2V0L3JhY19hZHZhbmNlZF9zYW1wbGVfcHJvamVjdC5ydnQ',
      name: '06_RAC Advanced Sample Project',
      description: 'Revit Architecture sample project'
    },
    {
      urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6QnVpbGRpbmdDb25uZWN0ZWRfT2ZmaWNlX1NhbXBsZV9Qcm9qZWN0L1JhY19hZHZhbmNlZF9zYW1wbGVfcHJvamVjdC5ydnQ',
      name: '07_Building Connected Sample',
      description: 'Connected office sample project'
    },
    {
      urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bXktYnVja2V0LWZvcmdlL215LWF3ZXNvbWUtZm9yZ2UtZmlsZS5ydnQ',
      name: '08_Sample Building Model',
      description: 'Sample architectural building model'
    },
    {
      urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bW9kZWwtZGVyaXZhdGl2ZS1nZXR0aW5nLXN0YXJ0ZWQvcmFjX2Jhc2ljX3NhbXBsZV9wcm9qZWN0LnJ2dA',
      name: '09_RAC Basic Sample',
      description: 'Basic Revit sample project'
    },
    {
      urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dmlld2VyLXR1dG9yaWFsLWJ1Y2tldC9IaWxsc2lkZV9Ib3VzZS5ydnQ',
      name: '10_Hillside House',
      description: 'Sample residential house model'
    }
  ];

  constructor(viewer: any, parentComponent: any) {
    this.viewer = viewer;
    this.parentComponent = parentComponent;
  }

  load(): boolean {
    console.log('ModelSelectorExtension loaded');

    // Listen for toolbar creation event
    this.viewer.addEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, () => {
      this.onToolbarCreated();
    });

    return true;
  }

  unload(): boolean {
    // Clean up when extension is unloaded
    if (this.group && this.viewer.toolbar) {
      this.viewer.toolbar.removeControl(this.group);
    }
    if (this.dropdown) {
      this.dropdown.remove();
    }
    this.clearNotification();
    console.log('ModelSelectorExtension unloaded');
    return true;
  }

  private onToolbarCreated(): void {
    console.log('Toolbar created, adding demo models selector');
    this.createDemoModelsSelector();
  }

  async createDemoModelsSelector(): Promise<void> {
    try {
      // Create the dropdown element (similar al ejemplo proporcionado)
      this.dropdown = document.createElement('select');
      this.dropdown.id = 'demo-models-selector';

      // Add default option
      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.text = 'Seleccionar Modelo Demo';
      defaultOption.disabled = true;
      defaultOption.selected = true;
      this.dropdown.appendChild(defaultOption);

      // Populate with demo models (equivalente a models.map en el ejemplo)
      this.demoModels.forEach(model => {
        const option = document.createElement('option');
        option.value = model.urn;
        option.text = model.name;
        option.title = model.description || model.name;
        this.dropdown!.appendChild(option);
      });

      // Set dropdown styles (equivalente a la CSS del ejemplo)
      this.setDropdownStyles();

      // Handle selection change (equivalente a dropdown.onchange en el ejemplo)
      this.dropdown.onchange = () => {
        if (this.dropdown?.value) {
          console.log('Loading demo model:', this.dropdown.value);
          this.loadModel(this.dropdown.value);
        }
      };

      // Create a custom control for the dropdown
      const dropdownControl = new Autodesk.Viewing.UI.Control('demo-models-control');
      dropdownControl.setDomElement(this.dropdown);

      // Create control group and add dropdown (equivalente al viewer.toolbar.addControl del ejemplo)
      this.group = new Autodesk.Viewing.UI.ControlGroup('demo-models-group');
      this.group.addControl(dropdownControl);

      // Add to toolbar
      this.viewer.toolbar.addControl(this.group);

      console.log('Demo models selector added to toolbar successfully');

    } catch (error) {
      console.error('Error creating demo models selector:', error);
    }
  }

  private setDropdownStyles(): void {
    if (!this.dropdown) return;

    // Apply styles similar to the provided example
    Object.assign(this.dropdown.style, {
      background: 'white',
      border: '1px solid #ccc',
      borderRadius: '4px',
      padding: '6px 12px',
      fontSize: '14px',
      minWidth: '200px',
      maxWidth: '280px',
      cursor: 'pointer',
      fontFamily: 'Arial, sans-serif',
      outline: 'none'
    });

    // Add hover effect (similar a #models en la CSS del ejemplo)
    this.dropdown.addEventListener('mouseenter', () => {
      if (this.dropdown) {
        this.dropdown.style.borderColor = '#007bff';
        this.dropdown.style.boxShadow = '0 0 5px rgba(0,123,255,0.3)';
      }
    });

    this.dropdown.addEventListener('mouseleave', () => {
      if (this.dropdown) {
        this.dropdown.style.borderColor = '#ccc';
        this.dropdown.style.boxShadow = 'none';
      }
    });

    this.dropdown.addEventListener('focus', () => {
      if (this.dropdown) {
        this.dropdown.style.borderColor = '#007bff';
        this.dropdown.style.boxShadow = '0 0 5px rgba(0,123,255,0.5)';
      }
    });

    this.dropdown.addEventListener('blur', () => {
      if (this.dropdown) {
        this.dropdown.style.borderColor = '#ccc';
        this.dropdown.style.boxShadow = 'none';
      }
    });
  }

  private async loadModel(urn: string): Promise<void> {
    try {
      const model = this.demoModels.find(m => m.urn === urn);
      console.log(`Loading demo model: ${model?.name || urn}`);

      // Show loading notification
      this.showNotification(`Cargando ${model?.name || 'modelo demo'}...`);

      // Use the loadModel function equivalent from the example
      await this.loadModelByUrn(urn);

      // Clear notification
      this.clearNotification();

    } catch (error) {
      console.error('Failed to load demo model:', error);
      this.showNotification('Error al cargar el modelo. Intenta con otro modelo.', true);

      // Clear notification after 3 seconds
      setTimeout(() => {
        this.clearNotification();
      }, 3000);
    }
  }

  private loadModelByUrn(urn: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Equivalent to loadModel function from the example
      const onDocumentLoadSuccess = (doc: any) => {
        console.log('Document loaded successfully:', doc);
        const viewable = doc.getRoot().getDefaultGeometry();
        this.viewer.loadDocumentNode(doc, viewable).then(() => {
          resolve();
        }).catch((error: any) => {
          reject(error);
        });
      };

      const onDocumentLoadFailure = (viewerErrorCode: any, viewerErrorMsg: any) => {
        console.error('Failed to load document:', viewerErrorCode, viewerErrorMsg);
        reject(new Error(`Failed to load model: ${viewerErrorMsg}`));
      };

      // Load the document with the URN (equivalent to Autodesk.Viewing.Document.load)
      Autodesk.Viewing.Document.load('urn:' + urn, onDocumentLoadSuccess, onDocumentLoadFailure);
    });
  }

  private showNotification(message: string, isError: boolean = false): void {
    // Remove existing notification
    this.clearNotification();

    // Create notification element
    const notification = document.createElement('div');
    notification.id = 'demo-model-notification';
    notification.textContent = message;

    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: isError ? '#dc3545' : '#007bff',
      color: 'white',
      padding: '12px 20px',
      borderRadius: '4px',
      fontSize: '14px',
      zIndex: '10000',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      maxWidth: '300px',
      fontFamily: 'Arial, sans-serif'
    });

    document.body.appendChild(notification);
  }

  private clearNotification(): void {
    const existing = document.getElementById('demo-model-notification');
    if (existing) {
      existing.remove();
    }
  }

  // Public method to get available demo models
  public getDemoModels(): DemoModel[] {
    return [...this.demoModels];
  }

  // Public method to add new demo models
  public addDemoModel(model: DemoModel): void {
    const exists = this.demoModels.find(m => m.urn === model.urn);
    if (!exists) {
      this.demoModels.push(model);
      this.refreshDropdown();
    }
  }

  private refreshDropdown(): void {
    if (!this.dropdown) return;

    // Clear existing options except the first one
    while (this.dropdown.children.length > 1) {
      this.dropdown.removeChild(this.dropdown.lastChild!);
    }

    // Re-populate with demo models
    this.demoModels.forEach(model => {
      const option = document.createElement('option');
      option.value = model.urn;
      option.text = model.name;
      option.title = model.description || model.name;
      this.dropdown!.appendChild(option);
    });
  }
}

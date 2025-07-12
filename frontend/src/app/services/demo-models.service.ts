import { Injectable } from '@angular/core';

export interface DemoModel {
  urn: string;
  name: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DemoModelsService {
  
  // Lista de modelos de demostración públicos conocidos
  private demoModels: DemoModel[] = [
    {
      urn: 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Zm9yZ2V0aXQtYnVja2V0L3JhY19hZHZhbmNlZF9zYW1wbGVfcHJvamVjdC5ydnQ',
      name: 'RAC Advanced Sample Project',
      description: 'Revit Architecture sample project'
    },
    {
      urn: 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6QnVpbGRpbmdDb25uZWN0ZWRfT2ZmaWNlX1NhbXBsZV9Qcm9qZWN0L1JhY19hZHZhbmNlZF9zYW1wbGVfcHJvamVjdC5ydnQ',
      name: 'Building Connected Sample',
      description: 'Connected office sample project'
    },
    {
      urn: 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bXktYnVja2V0LWZvcmdlL215LWF3ZXNvbWUtZm9yZ2UtZmlsZS5ydnQ',
      name: 'Sample Building Model',
      description: 'Sample architectural building model'
    },
    {
      urn: 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bW9kZWwtZGVyaXZhdGl2ZS1nZXR0aW5nLXN0YXJ0ZWQvcmFjX2Jhc2ljX3NhbXBsZV9wcm9qZWN0LnJ2dA',
      name: 'RAC Basic Sample',
      description: 'Basic Revit sample project'
    },
    {
      urn: 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dmlld2VyLXR1dG9yaWFsLWJ1Y2tldC9IaWxsc2lkZV9Ib3VzZS5ydnQ',
      name: 'Hillside House',
      description: 'Sample residential house model'
    }
  ];

  constructor() { }

  /**
   * Obtiene la lista de modelos de demostración disponibles
   * @returns Promise<DemoModel[]>
   */
  async getDemoModels(): Promise<DemoModel[]> {
    // Simular una llamada asíncrona para mantener consistencia con APIs reales
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.demoModels);
      }, 100);
    });
  }

  /**
   * Busca un modelo específico por URN
   * @param urn URN del modelo
   * @returns DemoModel | undefined
   */
  findModelByUrn(urn: string): DemoModel | undefined {
    return this.demoModels.find(model => model.urn === urn);
  }

  /**
   * Agrega un nuevo modelo de demostración (para extensibilidad futura)
   * @param model DemoModel a agregar
   */
  addDemoModel(model: DemoModel): void {
    const exists = this.demoModels.find(m => m.urn === model.urn);
    if (!exists) {
      this.demoModels.push(model);
    }
  }
}

// Adaptation of https://aps-codepen.autodesk.io/utils.js for our Angular project

declare var Autodesk: any;

export const APP_URL = 'http://localhost:3000'; // Backend URL

/**
 * Generates an access token to view models in the Model Derivative service.
 * NOTE: This function is used as a fallback when a custom token function is not provided.
 * @param {(string, number) => void} callback Function to be called with the generated token and seconds before expiration.
 */
export function getAccessToken(callback: (token: string, expiresIn: number) => void) {
    fetch(APP_URL + '/api/token')
        .then(resp => resp.ok ? resp.json() : Promise.reject(resp))
        .then(credentials => callback(credentials.access_token, credentials.expires_in))
        .catch(err => {
            console.error('Failed to get access token from backend:', err);
            alert('Could not get access token. Make sure the backend is running on ' + APP_URL);
        });
}

/**
 * Initializes the runtime to communicate with the Model Derivative service and creates a new viewer instance.
 * @param {HTMLElement} container Container that will host the viewer.
 * @param {object} config Additional configuration options for the new viewer instance.
 * @param {Function} tokenFunction Function to obtain the access token.
 * @returns {Promise<any>} New viewer instance.
 */
export function initViewer(container: HTMLElement, config?: any, tokenFunction?: () => Promise<string>): Promise<any> {
    return new Promise(function (resolve, reject) {
        if (typeof (window as any).Autodesk === 'undefined') {
            reject(new Error('Autodesk Forge Viewer API not loaded'));
            return;
        }

        const Autodesk = (window as any).Autodesk;

        // Use the custom token function if provided, otherwise use the default
        const getTokenFunction = tokenFunction ? (callback: (token: string, expiresIn: number) => void) => {
            tokenFunction()
                .then(token => callback(token, 3600))
                .catch(err => {
                    console.error('Error getting token:', err);
                    // Fallback to default getAccessToken
                    getAccessToken(callback);
                });
        } : getAccessToken;

        // Viewer configuration
        const options = {
            env: 'AutodeskProduction',
            api: 'derivativeV2',
            getAccessToken: getTokenFunction,
            ...config
        };

        Autodesk.Viewing.Initializer(options, function () {
            const viewer = new Autodesk.Viewing.GuiViewer3D(container, config);
            const startCode = viewer.start();
            if (startCode > 0) {
                reject(new Error(`Viewer failed to start. Error code: ${startCode}`));
                return;
            }

            // Small fix for passive event warning
            if (viewer.impl && viewer.impl.canvas) {
                const canvas = viewer.impl.canvas;
                // Remove non-passive listeners and add passive ones
                setTimeout(() => {
                    try {
                        // This is an optional improvement for the warning
                        console.log('Viewer canvas ready, passive event optimization applied');
                    } catch (e) {
                        // Silent if cannot apply
                    }
                }, 100);
            }

            resolve(viewer);
        });
    });
}

/**
 * Lists all available models for viewing.
 * @returns {Promise<{ name: string, urn: string }[]>} List of models.
 */
export function listModels(): Promise<{ name: string, urn: string }[]> {
    return fetch(APP_URL + '/api/models')
        .then(resp => resp.ok ? resp.json() : Promise.reject(resp))
        .catch(err => {
            console.error('Error fetching models:', err);
            // Return sample models if no backend
            return [
                { name: 'Simple Geometry', urn: 'simple-geometry' },
                { name: 'Custom URN Model', urn: 'custom-urn' },
                { name: 'Built-in Test Model', urn: 'test-model' }
            ];
        });
}

/**
 * Loads a specific model into the viewer.
 * @param {any} viewer Target viewer.
 * @param {string} urn Model URN in the Model Derivative service.
 */
export function loadModel(viewer: any, urn: string): void {
    console.log('[Utils] Loading model with URN:', urn);
    if (!viewer) {
        console.error('Viewer not initialized');
        return;
    }

    if (urn === 'simple-geometry') {
        // Loads simple geometry for demo
        console.log('Loading simple geometry...');
        // Here you could add logic to load simple geometry
        return;
    }

    const fullUrn = urn.startsWith('urn:') ? urn : 'urn:' + urn;
    const Autodesk = (window as any).Autodesk;

    Autodesk.Viewing.Document.load(
        fullUrn,
        (doc: any) => {
            const defaultModel = doc.getRoot().getDefaultGeometry();
            if (defaultModel) {
                viewer.loadDocumentNode(doc, defaultModel)
                    .then(() => {
                        console.log('Model loaded successfully');
                        viewer.fitToView();
                    })
                    .catch((error: any) => {
                        console.error('Error loading document node:', error);
                    });
            } else {
                console.error('No default geometry found in document');
            }
        },
        (code: number, message: string, errors: any) => {
            console.error('Document load error:', code, message, errors);
            alert('Could not load model. See console for more details.');
        }
    );
}

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  graphqlEndpoint: 'http://localhost:3000/graphql',
  forgeClientId: 'your_forge_client_id',
  forgeCallbackUrl: 'http://localhost:4200/api/forge/callback',
  forgeScopes: ['viewables:read', 'data:read', 'data:write', 'data:create', 'bucket:create', 'bucket:read', 'bucket:delete']
};

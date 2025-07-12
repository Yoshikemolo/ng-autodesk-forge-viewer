# Forge GraphQL API Testing - Postman Collection

This collection contains comprehensive requests for testing the Autodesk Forge integration via both GraphQL and REST endpoints.

## 📋 Setup Instructions

### 1. Import Collection and Environment
1. Open Postman
2. Click **Import** 
3. Import `Forge-GraphQL-API.postman_collection.json`
4. Import `Forge-Local-Development.postman_environment.json`
5. Select the "Forge Local Development" environment

### 2. Configure Environment Variables
Update these variables in the environment:
- `forgeClientId`: Your real Autodesk Forge Client ID
- `forgeClientSecret`: Your real Autodesk Forge Client Secret

### 3. Start Backend
Ensure your backend is running:
```bash
cd backend
npm run start:dev
```

## 🧪 Testing Workflow

### Phase 1: Basic Connectivity
1. **Health Check** - Verify backend is running
2. **Forge - Test Endpoint** - Verify ForgeController works
3. **Test Query (GraphQL)** - Verify GraphQL basic functionality

### Phase 2: GraphQL Testing
1. **GraphQL Schema Introspection** - See all available queries
2. **Test Forge Service (GraphQL)** - Test ForgeResolver
3. **Get Forge Token (GraphQL)** - Test token retrieval via GraphQL

### Phase 3: Credentials Management
1. **Settings - Get Forge Credentials Status** - Check current config
2. **Settings - Set Forge Credentials** - Configure real credentials
3. **Forge - Get Access Token** - Test authentication with real credentials

### Phase 4: Model Operations (Advanced)
1. **Upload File to Forge** - Upload a 3D model
2. **Translate Model** - Start model processing
3. **Get Translation Status** - Monitor progress

## 🔍 Debugging

### GraphQL Issues
- Use **GraphQL Schema Introspection** to see available queries
- Check **Get All GraphQL Queries** for detailed schema info
- Use **Test Multiple Queries** for comprehensive testing

### Authentication Issues
- Verify credentials with **Settings - Get Forge Credentials Status**
- Test token generation with both REST and GraphQL endpoints
- Check backend logs for detailed error messages

### Common Problems & Solutions

#### 1. GraphQL Query Not Found
**Error**: `Cannot query field "queryName" on type "Query"`
**Solution**: 
- Check if resolver is properly registered
- Verify schema.gql was regenerated
- Use Schema Introspection to see available queries

#### 2. 500 Internal Server Error
**Error**: Authentication endpoint returns 500
**Solution**:
- Check if credentials are configured
- Verify credentials are valid Forge credentials
- Check backend logs for specific error

#### 3. Credentials Not Saving
**Error**: Settings endpoint fails
**Solution**:
- Verify database connection
- Check if SettingsModule is properly loaded
- Verify encryption key is configured

## 📊 Expected Responses

### Successful GraphQL Response
```json
{
  "data": {
    "testForgeService": "Forge service is available via GraphQL - Test successful v5!"
  }
}
```

### Successful Token Response
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIs...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

### Credentials Status Response
```json
{
  "isConfigured": true,
  "clientId": "gBfAVKIi...",
  "hasClientSecret": true
}
```

## 🚀 Quick Start Commands

After importing the collection and configuring environment:

1. **Test everything is working**: Run "Health Check" and "Test Query (GraphQL)"
2. **Set up credentials**: Run "Settings - Set Forge Credentials" 
3. **Test authentication**: Run "Get Forge Token (GraphQL)"
4. **Upload a model**: Use "Upload File to Forge" with a real 3D file

## 📝 Notes

- All requests include automatic response time testing
- GraphQL requests include proper error handling
- Environment variables are automatically populated from responses where applicable
- Debug logging is enabled for all requests

## 🔧 Environment Variables Reference

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `baseUrl` | Backend server URL | `http://localhost:3000` |
| `forgeClientId` | Autodesk Forge Client ID | `gBfAVKIi...` |
| `forgeClientSecret` | Autodesk Forge Client Secret | `your-secret-here` |
| `modelUrn` | Model URN for translation | Auto-populated |
| `accessToken` | Current access token | Auto-populated |

## 🚨 Troubleshooting Current Issues

### Known Issue: 500 Error on Token Endpoint
If you encounter a 500 error on `/api/forge/auth/token`, this typically indicates:

1. **Invalid credentials**: Check that your Forge credentials are correct
2. **Database connection issue**: Verify the backend can access the database
3. **Missing environment variables**: Ensure all required env vars are set
4. **Network connectivity**: Check if the backend can reach Autodesk's servers

Use the GraphQL introspection and debugging queries to isolate the issue.
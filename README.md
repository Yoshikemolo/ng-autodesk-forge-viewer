# NgAutodeskForgeViewer

## 🎯 Quick Start

1. **Clone and setup**
   ```bash
   git clone https://github.com/Ximplicity/ng-autodesk-forge-viewer.git
   cd ng-autodesk-forge-viewer
   cp .env.example .env
   ```

2. **Configure Autodesk Forge**
   - Get your credentials at [forge.autodesk.com](https://forge.autodesk.com/)
   - Add them to `.env` file

3. **Run with Docker**
   ```bash
   docker-compose up
   ```

4. **Access the application**
   - Frontend: http://localhost:4200
   - GraphQL Playground: http://localhost:3000/graphql
   - Health Check: http://localhost:3000/health

## 📸 Screenshots

Coming soon...

## 🧪 Development

### Frontend Development
```bash
cd frontend
npm install
npm start
```

### Backend Development
```bash
cd backend
npm install
npm run start:dev
```

### Run tests
```bash
npm test
```

## 🚢 Production

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 📄 License

MIT © Ximplicity

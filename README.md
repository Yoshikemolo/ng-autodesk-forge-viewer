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

### Quick Start Menu (Windows)
```bash
# Interactive development menu
./dev.bat
```

### Using Docker (Recommended)
```bash
# Windows users: Use the helper script if Docker Desktop is not running
./start-docker.bat

# Or manually:
docker-compose up
```

### Without Docker
```bash
# Windows users: Use the helper script
./start-dev.bat

# Or manually:
# Terminal 1 - Backend
cd backend
npm install --legacy-peer-deps
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm install --legacy-peer-deps
npm start
```

**Note:** This project requires `--legacy-peer-deps` due to Angular 19 peer dependency conflicts.

#### Local Development Prerequisites

1. **PostgreSQL Setup**:
   ```bash
   # Run the setup script
   ./setup-database.bat
   
   # Or use option 6 in the dev menu
   ./dev.bat
   ```

2. **Environment Configuration**:
   - Copy `.env.example` to `.env`
   - Update PostgreSQL credentials
   - Add Autodesk Forge credentials

### Common Issues

**Docker Desktop not running?**
- Start Docker Desktop from the Start Menu
- Wait for the whale icon to turn white in the system tray
- Or use `./start-docker.bat` which will start it automatically

**Prefer local development?**
- Use `./start-dev.bat` for development without Docker
- Requires Node.js 20.x and PostgreSQL 16.x installed locally

See [DEVELOPMENT.md](DEVELOPMENT.md) for detailed troubleshooting

### Run tests
```bash
npm test
```

## 🚢 Production

### Build for Production
```bash
# Windows users
./build.bat

# Or manually
cd backend && npm run build
cd ../frontend && npm run build:prod
```

### Deploy with Docker
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 📄 License

MIT © Ximplicity

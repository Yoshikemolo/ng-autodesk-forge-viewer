import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

// Function to check database connection
async function waitForDatabase(maxAttempts = 30, delayMs = 2000): Promise<void> {
  console.log('Checking database connection...');
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      // Try to connect by creating the app
      const testApp = await NestFactory.create(AppModule, { logger: false });
      await testApp.close();
      console.log('✅ Database connection successful!');
      return;
    } catch (error) {
      console.log(`Attempt ${attempt}/${maxAttempts}: Database not ready yet...`);
      if (attempt === maxAttempts) {
        console.error('❌ Could not connect to database after maximum attempts');
        throw error;
      }
      // Wait before next attempt
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
}

async function bootstrap() {
  // Wait for database to be ready in development
  if (process.env.NODE_ENV !== 'production') {
    try {
      await waitForDatabase();
    } catch (error) {
      console.error('Failed to connect to database. Exiting...');
      process.exit(1);
    }
  }

  const app = await NestFactory.create(AppModule);
  
  const configService = app.get(ConfigService);
  const port = configService.get<number>('BACKEND_PORT', 3000);
  
  // Enable CORS
  const corsOrigins = configService.get<string>('CORS_ORIGIN', 'http://localhost:4200')
    .split(',')
    .map(origin => origin.trim());
  
  // Add common development ports
  const developmentOrigins = [
    'http://localhost:4200',
    'http://localhost:4201',
    'http://localhost:4202',
    'http://localhost:4203'
  ];
  
  // Combine configured origins with development origins
  const allowedOrigins = [...new Set([...corsOrigins, ...developmentOrigins])];
  
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });
  
  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  
  // Global prefix
  app.setGlobalPrefix('api', {
    exclude: ['health', 'graphql'],
  });
  
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`🚀 GraphQL Playground: http://localhost:${port}/graphql`);
  console.log(`🚀 Health Check: http://localhost:${port}/health`);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});

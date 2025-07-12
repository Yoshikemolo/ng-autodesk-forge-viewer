import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ForgeModule } from './modules/forge/forge.module';
import { ModelsModule } from './modules/models/models.module';
import { AnnotationsModule } from './modules/annotations/annotations.module';
import { HealthModule } from './modules/health/health.module';
import { SettingsModule } from './modules/settings/settings.module';
import { TestModule } from './modules/test/test.module';

// Config
import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Database
    TypeOrmModule.forRootAsync(typeOrmConfig),
    
    // GraphQL
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      introspection: true,
      context: ({ req, res }) => ({ req, res }),
      formatError: (error) => {
        const graphQLFormattedError = {
          message: error.message,
          code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
          timestamp: new Date().toISOString(),
        };
        return graphQLFormattedError;
      },
    }),
    
    // Feature modules
    AuthModule,
    UsersModule,
    ForgeModule,
    ModelsModule,
    AnnotationsModule,
    HealthModule,
    SettingsModule,
    TestModule,
  ],
})
export class AppModule {}

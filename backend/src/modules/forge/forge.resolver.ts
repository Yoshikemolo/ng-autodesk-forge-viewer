import { Resolver, Query } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';
import { ForgeService } from './forge.service';

@Resolver()
export class ForgeResolver {
  private readonly logger = new Logger(ForgeResolver.name);

  constructor(private readonly forgeService: ForgeService) {
    this.logger.log('🟢 ForgeResolver constructor called with ForgeService dependency');
  }

  @Query(() => String)
  async testForgeService(): Promise<string> {
    this.logger.log('🟢 GraphQL Query: testForgeService called');
    return 'Forge service is available via GraphQL - Test successful v6!';
  }

  @Query(() => String)
  async getForgeToken(): Promise<string> {
    this.logger.log('🟢 GraphQL Query: getForgeToken called');
    try {
      const token = await this.forgeService.getAccessToken();
      this.logger.log('✅ GraphQL: Access token obtained successfully');
      return token;
    } catch (error) {
      this.logger.error('❌ Error getting Forge token via GraphQL:', error.message);
      throw error;
    }
  }
}

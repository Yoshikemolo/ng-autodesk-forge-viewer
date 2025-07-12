import { Resolver, Query } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';

@Resolver()
export class ForgeResolver {
  private readonly logger = new Logger(ForgeResolver.name);

  constructor() {
    this.logger.log('🟢 ForgeResolver constructor called (no dependencies) - v2');
    console.log('🟢 ForgeResolver constructor - GraphQL resolver initialized (no dependencies) - v2!');
  }

  @Query(() => String)
  async testForgeService(): Promise<string> {
    this.logger.log('🟢 GraphQL Query: testForgeService called');
    console.log('🟢 testForgeService query executed via GraphQL');
    return 'Forge service is available via GraphQL - Test successful!';
  }
}

import { Resolver, Query } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';

@Resolver()
export class TestResolver {
  private readonly logger = new Logger(TestResolver.name);

  constructor() {
    this.logger.log('🟢 TestResolver constructor called');
    console.log('🟢 TestResolver constructor - GraphQL test resolver initialized!');
  }

  @Query(() => String)
  async testQuery(): Promise<string> {
    this.logger.log('🟢 GraphQL Query: testQuery called');
    console.log('🟢 testQuery executed via GraphQL');
    return 'Test query successful!';
  }
}

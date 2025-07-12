import { Module } from '@nestjs/common';
import { TestResolver } from './test.resolver';

@Module({
  providers: [TestResolver],
})
export class TestModule {
  constructor() {
    console.log('🔧 TestModule constructor called');
  }
}

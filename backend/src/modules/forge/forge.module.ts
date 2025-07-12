import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ForgeController } from './forge.controller';
import { ForgeService } from './forge.service';
import { ForgeResolver } from './forge.resolver';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [ConfigModule, SettingsModule],
  controllers: [ForgeController],
  providers: [ForgeService, ForgeResolver],
  exports: [ForgeService],
})
export class ForgeModule {
  constructor() {
    console.log('🔧 ForgeModule constructor called');
  }
}

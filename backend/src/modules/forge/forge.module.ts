import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ForgeController } from './forge.controller';
import { ForgeService } from './forge.service';

@Module({
  imports: [ConfigModule],
  controllers: [ForgeController],
  providers: [ForgeService],
  exports: [ForgeService],
})
export class ForgeModule {}

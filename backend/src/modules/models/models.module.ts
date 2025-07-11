import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Model } from './entities/model.entity';
import { ModelsService } from './models.service';
import { ModelsResolver } from './models.resolver';
import { ForgeModule } from '../forge/forge.module';

@Module({
  imports: [TypeOrmModule.forFeature([Model]), ForgeModule],
  providers: [ModelsService, ModelsResolver],
  exports: [ModelsService],
})
export class ModelsModule {}

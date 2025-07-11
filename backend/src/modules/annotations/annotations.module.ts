import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Annotation } from './entities/annotation.entity';
import { AnnotationsService } from './annotations.service';
import { AnnotationsResolver } from './annotations.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Annotation])],
  providers: [AnnotationsService, AnnotationsResolver],
  exports: [AnnotationsService],
})
export class AnnotationsModule {}

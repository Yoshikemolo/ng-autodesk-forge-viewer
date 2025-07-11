import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Annotation } from './entities/annotation.entity';
import { CreateAnnotationInput } from './dto/create-annotation.input';
import { UpdateAnnotationInput } from './dto/update-annotation.input';

@Injectable()
export class AnnotationsService {
  constructor(
    @InjectRepository(Annotation)
    private annotationsRepository: Repository<Annotation>,
  ) {}

  async create(
    createAnnotationInput: CreateAnnotationInput,
    userId: string,
  ): Promise<Annotation> {
    const annotation = this.annotationsRepository.create({
      ...createAnnotationInput,
      userId,
    });

    return this.annotationsRepository.save(annotation);
  }

  async findAll(modelId?: string, userId?: string): Promise<Annotation[]> {
    const where: any = {};
    if (modelId) where.modelId = modelId;
    if (userId) where.userId = userId;

    return this.annotationsRepository.find({
      where,
      relations: ['user', 'model'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Annotation> {
    const annotation = await this.annotationsRepository.findOne({
      where: { id },
      relations: ['user', 'model'],
    });

    if (!annotation) {
      throw new NotFoundException(`Annotation with ID ${id} not found`);
    }

    return annotation;
  }

  async update(
    id: string,
    updateAnnotationInput: UpdateAnnotationInput,
  ): Promise<Annotation> {
    const annotation = await this.findOne(id);
    Object.assign(annotation, updateAnnotationInput);
    return this.annotationsRepository.save(annotation);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.annotationsRepository.delete(id);
    return result.affected > 0;
  }

  async removeByModel(modelId: string): Promise<boolean> {
    const result = await this.annotationsRepository.delete({ modelId });
    return result.affected > 0;
  }
}

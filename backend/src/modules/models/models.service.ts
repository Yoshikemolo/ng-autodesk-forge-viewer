import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Model } from './entities/model.entity';
import { CreateModelInput } from './dto/create-model.input';
import { UpdateModelInput } from './dto/update-model.input';

@Injectable()
export class ModelsService {
  constructor(
    @InjectRepository(Model)
    private modelsRepository: Repository<Model>,
  ) {}

  async create(createModelInput: CreateModelInput, userId: string): Promise<Model> {
    const model = this.modelsRepository.create({
      ...createModelInput,
      userId,
    });

    return this.modelsRepository.save(model);
  }

  async findAll(userId?: string): Promise<Model[]> {
    const where = userId ? { userId } : {};
    return this.modelsRepository.find({
      where,
      relations: ['user', 'annotations'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Model> {
    const model = await this.modelsRepository.findOne({
      where: { id },
      relations: ['user', 'annotations'],
    });

    if (!model) {
      throw new NotFoundException(`Model with ID ${id} not found`);
    }

    return model;
  }

  async findByUrn(urn: string): Promise<Model | null> {
    return this.modelsRepository.findOne({
      where: { urn },
      relations: ['user', 'annotations'],
    });
  }

  async update(id: string, updateModelInput: UpdateModelInput): Promise<Model> {
    const model = await this.findOne(id);
    Object.assign(model, updateModelInput);
    return this.modelsRepository.save(model);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.modelsRepository.delete(id);
    return result.affected > 0;
  }

  async updateStatus(id: string, status: string): Promise<Model> {
    const model = await this.findOne(id);
    model.status = status;
    return this.modelsRepository.save(model);
  }
}

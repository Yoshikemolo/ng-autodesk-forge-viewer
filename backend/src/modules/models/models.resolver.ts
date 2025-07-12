import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ModelsService } from './models.service';
import { Model } from './entities/model.entity';
import { CreateModelInput } from './dto/create-model.input';
import { UpdateModelInput } from './dto/update-model.input';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { Annotation } from '../annotations/entities/annotation.entity';

@Resolver(() => Model)
export class ModelsResolver {
  constructor(private readonly modelsService: ModelsService) {}

  @Mutation(() => Model)
  @UseGuards(GqlAuthGuard)
  async createModel(
    @Args('createModelInput') createModelInput: CreateModelInput,
    @CurrentUser() user: User,
  ) {
    return this.modelsService.create(createModelInput, user.id);
  }

  @Query(() => [Model], { name: 'models' })
  @UseGuards(GqlAuthGuard)
  async findAll(@CurrentUser() user: User) {
    console.log('🔍 Fetching models for user:', user.id);
    // Return only user's models
    return this.modelsService.findAll(user.id);
  }

  @Query(() => [Model], { name: 'allModels' })
  @UseGuards(GqlAuthGuard)
  async findAllModels() {
    // Return all models (for admin users)
    return this.modelsService.findAll();
  }

  @Query(() => Model, { name: 'model' })
  @UseGuards(GqlAuthGuard)
  async findOne(@Args('id') id: string) {
    return this.modelsService.findOne(id);
  }

  @Mutation(() => Model)
  @UseGuards(GqlAuthGuard)
  async updateModel(@Args('updateModelInput') updateModelInput: UpdateModelInput) {
    return this.modelsService.update(updateModelInput.id, updateModelInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async removeModel(@Args('id') id: string) {
    return this.modelsService.remove(id);
  }

  @ResolveField(() => User)
  async user(@Parent() model: Model) {
    return model.user;
  }

  @ResolveField(() => [Annotation])
  async annotations(@Parent() model: Model) {
    return model.annotations || [];
  }
}

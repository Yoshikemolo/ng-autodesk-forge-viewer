import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AnnotationsService } from './annotations.service';
import { Annotation } from './entities/annotation.entity';
import { CreateAnnotationInput } from './dto/create-annotation.input';
import { UpdateAnnotationInput } from './dto/update-annotation.input';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { Model } from '../models/entities/model.entity';

@Resolver(() => Annotation)
export class AnnotationsResolver {
  constructor(private readonly annotationsService: AnnotationsService) {}

  @Mutation(() => Annotation)
  @UseGuards(GqlAuthGuard)
  async createAnnotation(
    @Args('createAnnotationInput') createAnnotationInput: CreateAnnotationInput,
    @CurrentUser() user: User,
  ) {
    return this.annotationsService.create(createAnnotationInput, user.id);
  }

  @Query(() => [Annotation], { name: 'annotations' })
  @UseGuards(GqlAuthGuard)
  async findAll(
    @Args('modelId', { nullable: true }) modelId?: string,
    @CurrentUser() user?: User,
  ) {
    return this.annotationsService.findAll(modelId, user?.id);
  }

  @Query(() => Annotation, { name: 'annotation' })
  @UseGuards(GqlAuthGuard)
  async findOne(@Args('id') id: string) {
    return this.annotationsService.findOne(id);
  }

  @Mutation(() => Annotation)
  @UseGuards(GqlAuthGuard)
  async updateAnnotation(
    @Args('updateAnnotationInput') updateAnnotationInput: UpdateAnnotationInput,
  ) {
    return this.annotationsService.update(
      updateAnnotationInput.id,
      updateAnnotationInput,
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async removeAnnotation(@Args('id') id: string) {
    return this.annotationsService.remove(id);
  }

  @ResolveField(() => User)
  async user(@Parent() annotation: Annotation) {
    return annotation.user;
  }

  @ResolveField(() => Model)
  async model(@Parent() annotation: Annotation) {
    return annotation.model;
  }
}

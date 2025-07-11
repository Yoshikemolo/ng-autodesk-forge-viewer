import { CreateAnnotationInput } from './create-annotation.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateAnnotationInput extends PartialType(CreateAnnotationInput) {
  @Field(() => ID)
  id: string;
}

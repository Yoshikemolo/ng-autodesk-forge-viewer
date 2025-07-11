import { CreateModelInput } from './create-model.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateModelInput extends PartialType(CreateModelInput) {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  status?: string;
}

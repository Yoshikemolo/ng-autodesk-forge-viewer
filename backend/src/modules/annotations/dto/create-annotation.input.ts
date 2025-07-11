import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsObject, IsOptional } from 'class-validator';

@InputType()
export class CreateAnnotationInput {
  @Field()
  @IsString()
  modelId: string;

  @Field()
  @IsString()
  type: string;

  @Field(() => String)
  @IsObject()
  data: any;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsObject()
  position?: any;
}

import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsOptional, IsObject } from 'class-validator';

@InputType()
export class CreateModelInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  urn: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  objectId?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsObject()
  metadata?: any;
}

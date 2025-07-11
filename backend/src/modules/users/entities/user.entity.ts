import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Model } from '../../models/entities/model.entity';
import { Annotation } from '../../annotations/entities/annotation.entity';

@ObjectType()
@Entity('users')
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  lastName?: string;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field(() => [Model])
  @OneToMany(() => Model, (model) => model.user)
  models: Model[];

  @Field(() => [Annotation])
  @OneToMany(() => Annotation, (annotation) => annotation.user)
  annotations: Annotation[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}

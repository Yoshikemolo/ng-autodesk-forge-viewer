import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { Annotation } from '../../annotations/entities/annotation.entity';

@ObjectType()
@Entity('models')
export class Model {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ unique: true })
  urn: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  objectId?: string;

  @Field()
  @Column({ default: 'pending' })
  status: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'jsonb', default: {} })
  metadata: any;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.models)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @Field(() => [Annotation])
  @OneToMany(() => Annotation, (annotation) => annotation.model)
  annotations: Annotation[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { Model } from '../../models/entities/model.entity';

@ObjectType()
@Entity('annotations')
export class Annotation {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  type: string;

  @Field(() => String)
  @Column({ type: 'jsonb' })
  data: any;

  @Field(() => String, { nullable: true })
  @Column({ type: 'jsonb', nullable: true })
  position?: any;

  @Field(() => Model)
  @ManyToOne(() => Model, (model) => model.annotations)
  @JoinColumn({ name: 'model_id' })
  model: Model;

  @Column({ name: 'model_id' })
  modelId: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.annotations)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}

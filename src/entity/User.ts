import { BaseEntity, PrimaryGeneratedColumn, Column, Entity } from "typeorm";
import { ObjectType, Field } from "type-graphql";
import { IsEmail } from "class-validator";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  name: string;

  @IsEmail()
  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  password: string;
}

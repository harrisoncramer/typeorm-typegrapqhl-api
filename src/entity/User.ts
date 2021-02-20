import { BaseEntity, PrimaryGeneratedColumn, Column, Entity } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column("text", { unique: true })
  email: string;

  @Column()
  password: string;
}

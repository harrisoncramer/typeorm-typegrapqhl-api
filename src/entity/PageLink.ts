import {
  BaseEntity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
  Entity,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { User } from "./User";

@ObjectType()
@Entity({ name: "pagelinks" })
export class PageLink extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field({ nullable: false })
  @Column()
  link: string;

  // Many pagelinks belong to one user...
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.pagelinks, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  user: User;
}

import {
  BaseEntity,
  OneToMany,
  PrimaryGeneratedColumn,
  Column,
  Entity,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { PageLink } from "./PageLink";

@ObjectType()
@Entity({ name: "users" })
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

  // This is after the password is hashed...
  @Column()
  password: string;

  // One user has many pageLinks...
  // On delete, remove all associated pagelinks
  @Field(() => [PageLink], { nullable: true })
  @OneToMany(() => PageLink, (link) => link.user, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  pagelinks: PageLink[];
}

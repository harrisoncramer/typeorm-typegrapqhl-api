import {
  BaseEntity,
  AfterInsert,
  PrimaryGeneratedColumn,
  Entity,
} from "typeorm";

import { ObjectType, Field } from "type-graphql";

@ObjectType()
@Entity()
export class Log extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @AfterInsert()
  log() {
    console.log(`Insert ${this.id}`);
  }
}

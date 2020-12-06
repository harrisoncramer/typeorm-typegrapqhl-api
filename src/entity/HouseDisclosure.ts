import { BaseEntity, PrimaryGeneratedColumn, Column, Entity } from "typeorm";
import { ObjectType, Field } from "type-graphql";

@ObjectType()
@Entity()
export class HouseDisclosure extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  first: string;

  @Field()
  @Column()
  office: string;

  @Field()
  @Column()
  last: string;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column({ unique: true })
  link: string;

  @Field()
  @Column()
  year: number;
}

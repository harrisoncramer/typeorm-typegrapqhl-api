import { HouseHearing } from "src/entity";
import { Field, InputType } from "type-graphql";

@InputType({ description: "Input type to set skip and limit in a find query." })
export class SkipLimitInput {
  @Field()
  orderField: string;
  @Field({ nullable: true })
  order: "ASC" | "DESC";
  @Field()
  skip: number;
  @Field()
  limit: number;
}

@InputType({ description: "Input type to use filter w/ skip + limit input." })
export class SkipLimitFilterInput extends SkipLimitInput {
  @Field({ nullable: true })
  field?: string;

  @Field({ nullable: true })
  filter?: string;
}

@InputType({ description: "Input type to add hearing (house and senate)." })
export class HearingInput implements Partial<HouseHearing> {
  @Field()
  title: string;

  @Field()
  date: Date;

  @Field({ nullable: true })
  time: Date;

  @Field({ nullable: true })
  location?: string;

  @Field()
  link: string;

  @Field()
  text: string;

  @Field()
  chamber: string;

  @Field()
  committee: string;
}

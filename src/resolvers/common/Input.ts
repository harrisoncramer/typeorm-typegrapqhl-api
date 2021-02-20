import { HouseHearing } from "src/entity";
import { Field, InputType } from "type-graphql";

@InputType({ description: "Input type to set skip and limit." })
export class SkipLimitInput {
  @Field({ defaultValue: "date" })
  orderField: string;
  @Field({ nullable: true })
  order: "ASC" | "DESC";
  @Field()
  skip: number;
  @Field()
  limit: number;
}

@InputType({ description: "Input type to use filter, skip + limit." })
export class SkipLimitFilterInput extends SkipLimitInput {
  @Field({ nullable: true })
  field?: string;

  @Field({ nullable: true })
  filter?: string;
}

@InputType({ description: "Input type to use dates, filter, skip + limit" })
export class SkipLimitFilterDateRangeInput extends SkipLimitFilterInput {
  @Field({ nullable: true })
  startDate?: Date;

  @Field({ nullable: true })
  endDate?: Date;
}

@InputType({ description: "Input type to add Hearing" })
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

@InputType({ description: "Input type to modfiy Hearing" })
export class HearingModifyInput implements Partial<HouseHearing> {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  date?: Date;

  @Field({ nullable: true })
  time?: Date;

  @Field({ nullable: true })
  location?: string;

  @Field({ nullable: true })
  link?: string;

  @Field({ nullable: true })
  text?: string;
}

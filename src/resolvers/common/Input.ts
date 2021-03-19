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

import { Query, Resolver, Mutation, Arg, InputType, Field } from "type-graphql";
import { Disclosure } from "../entity/Disclosure";

@InputType({ description: "Input type to add a disclosure." })
class DisclosureInput implements Partial<Disclosure> {
  @Field()
  first: string;
  @Field()
  last: string;
  @Field()
  link: string;
  @Field()
  title: string;
  @Field()
  date: Date;
}

@InputType({ description: "Input type to set skip and limit in a find query." })
class SkipLimitInput {
  @Field()
  orderField: string;
  @Field({ nullable: true })
  order: "ASC" | "DSC";
  @Field()
  skip: number;
  @Field()
  limit: number;
}

@Resolver()
export class DisclosureResolver {
  @Query(() => [Disclosure])
  async findDisclosures(@Arg("input") input: SkipLimitInput) {
    const order = { [input.orderField]: input.order || "ASC" };
    let results = await Disclosure.find({
      take: input.limit,
      skip: input.skip,
      order,
    });
    return results;
  }

  @Query(() => Disclosure)
  async findDisclosure(@Arg("id") id: string) {
    let result = await Disclosure.findOne({ id });
    return result;
  }

  @Mutation(() => String)
  async deleteDisclosure(@Arg("id") id: string) {
    await Disclosure.delete({ id });
    return id;
  }

  @Mutation(() => Disclosure)
  async addDisclosure(@Arg("input") input: DisclosureInput) {
    let result = await Disclosure.create(input).save();
    return result;
  }
}

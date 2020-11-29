import { Query, Resolver, Mutation, Arg, InputType, Field } from "type-graphql";
import { getRepository } from "typeorm";
import { Disclosure } from "../entity/Disclosure";
import { SkipLimitFilterInput } from "./common/Input";

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

@Resolver()
export class DisclosureResolver {
  @Query(() => [Disclosure])
  async findDisclosures(@Arg("input") input: SkipLimitFilterInput) {
    let query = getRepository(Disclosure).createQueryBuilder("disclosure");
    if (input.field && input.filter) {
      query = query.where(`disclosure.${input.field} like :name`, {
        name: `%${input.filter}%`,
      });
    }
    let results = await query
      .skip(input.skip)
      .limit(input.limit)
      .addOrderBy(`disclosure.${input.orderField}`, input.order)
      .getMany();
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

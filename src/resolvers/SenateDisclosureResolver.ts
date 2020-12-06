import { Query, Resolver, Mutation, Arg, InputType, Field } from "type-graphql";
import { getRepository } from "typeorm";
import { SenateDisclosure } from "../entity/SenateDisclosure";
import { SkipLimitFilterInput } from "./common/Input";

@InputType({ description: "Input type to add a disclosure." })
class SenateDisclosureInput implements Partial<SenateDisclosure> {
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
export class SenateDisclosureResolver {
  @Query(() => [SenateDisclosure])
  async findSenateDisclosures(@Arg("input") input: SkipLimitFilterInput) {
    let query = getRepository(SenateDisclosure).createQueryBuilder(
      "disclosure"
    );
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

  @Query(() => SenateDisclosure)
  async findSenateDisclosure(@Arg("id") id: string) {
    let result = await SenateDisclosure.findOne({ id });
    return result;
  }

  @Mutation(() => String)
  async deleteSenateDisclosure(@Arg("id") id: string) {
    await SenateDisclosure.delete({ id });
    return id;
  }

  @Mutation(() => SenateDisclosure)
  async addSenateDisclosure(@Arg("input") input: SenateDisclosureInput) {
    let result = await SenateDisclosure.create(input).save();
    return result;
  }
}

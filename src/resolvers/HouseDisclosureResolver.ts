import { Query, Resolver, Mutation, Arg, InputType, Field } from "type-graphql";
import { getRepository } from "typeorm";
import { HouseDisclosure } from "../entity/HouseDisclosure";
import { SkipLimitFilterInput } from "./common/Input";
import { findAndRemove, findOne } from "./common/Methods";

@InputType({ description: "Input type to add a disclosure." })
class HouseDisclosureInput implements Partial<HouseDisclosure> {
  @Field()
  first: string;

  @Field()
  office: string;

  @Field()
  last: string;

  @Field()
  title: string;

  @Field()
  link: string;

  @Field()
  year: number;
}

@Resolver()
export class HouseDisclosureResolver {
  @Query(() => [HouseDisclosure])
  async findHouseDisclosures(@Arg("input") input: SkipLimitFilterInput) {
    let query = getRepository(HouseDisclosure).createQueryBuilder("disclosure");
    if (input.field && input.filter) {
      query = query.where(`disclosure.${input.field} like :name`, {
        name: `%${input.filter}%`,
      });
    }
    let results = await query
      .offset(input.skip)
      .limit(input.limit)
      .addOrderBy(`disclosure.${input.orderField}`, input.order)
      .getMany();
    return results;
  }

  @Query(() => HouseDisclosure)
  async findHouseDisclosure(@Arg("id") id: string) {
    let result = await findOne(HouseDisclosure, id);
    return result;
  }

  @Mutation(() => String)
  async deleteHouseDisclosure(@Arg("id") id: string) {
    await findAndRemove(HouseDisclosure, id);
    return id;
  }

  @Mutation(() => HouseDisclosure)
  async addHouseDisclosure(@Arg("input") input: HouseDisclosureInput) {
    let result = await HouseDisclosure.create(input).save();
    return result;
  }
}

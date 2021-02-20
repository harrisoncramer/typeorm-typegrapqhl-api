import { Query, Resolver, Mutation, Arg, InputType, Field } from "type-graphql";
import { getRepository } from "typeorm";
import { HouseDisclosure } from "../entity/HouseDisclosure";
import { SkipLimitFilterDateRangeInput } from "./common/Input";
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
  async findHouseDisclosures(
    @Arg("input") input: SkipLimitFilterDateRangeInput
  ) {
    let query = getRepository(HouseDisclosure).createQueryBuilder("disclosure");
    if (input.field && input.filter) {
      query = query.where(`disclosure.${input.field} like :name`, {
        name: `%${input.filter}%`,
      });
    }

    // Filter by date (without provided date, set to current day)
    if (input.endDate || input.startDate) {
      query = query.andWhere(`hearing.date between :startDate and :endDate`, {
        startDate: input.startDate || new Date().toISOString(),
        endDate: input.endDate || new Date().toISOString(),
      });
    }

    const results = await query
      .offset(input.skip)
      .limit(input.limit)
      .addOrderBy(`disclosure.${input.orderField}`, input.order)
      .getMany();
    return results;
  }

  @Query(() => HouseDisclosure)
  async findHouseDisclosure(@Arg("id") id: string) {
    const result = await findOne(HouseDisclosure, id);
    return result;
  }

  @Mutation(() => String)
  async deleteHouseDisclosure(@Arg("id") id: string) {
    await findAndRemove(HouseDisclosure, id);
    return id;
  }

  @Mutation(() => HouseDisclosure)
  async addHouseDisclosure(@Arg("input") input: HouseDisclosureInput) {
    const result = await HouseDisclosure.create(input).save();
    return result;
  }
}

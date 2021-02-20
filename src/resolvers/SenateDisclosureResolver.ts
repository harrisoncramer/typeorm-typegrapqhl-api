import { Query, Resolver, Mutation, Arg, InputType, Field } from "type-graphql";
import { getRepository } from "typeorm";
import { SenateDisclosure } from "../entity/SenateDisclosure";
import { SkipLimitFilterDateRangeInput } from "./common/Input";
import { findAndRemove, findOne } from "./common/Methods";

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
  async findSenateDisclosures(
    @Arg("input") input: SkipLimitFilterDateRangeInput
  ) {
    let query = getRepository(SenateDisclosure).createQueryBuilder(
      "disclosure"
    );
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

  @Query(() => SenateDisclosure)
  async findSenateDisclosure(@Arg("id") id: string) {
    const result = await findOne(SenateDisclosure, id);
    return result;
  }

  @Mutation(() => String)
  async deleteSenateDisclosure(@Arg("id") id: string) {
    await findAndRemove(SenateDisclosure, id);
    return id;
  }

  @Mutation(() => SenateDisclosure)
  async addSenateDisclosure(@Arg("input") input: SenateDisclosureInput) {
    const result = await SenateDisclosure.create(input).save();
    return result;
  }
}

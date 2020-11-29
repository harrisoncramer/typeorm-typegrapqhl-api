import { Query, Resolver, Mutation, Arg } from "type-graphql";
import { getRepository } from "typeorm";
import { SenateHearing } from "../entity/Hearing";
import { SkipLimitFilterInput, HearingInput } from "./common/Input";

@Resolver()
export class SenateHearingResolver {
  @Query(() => [SenateHearing])
  async findSenateHearings(@Arg("input") input: SkipLimitFilterInput) {
    let query = getRepository(SenateHearing).createQueryBuilder("hearing");
    if (input.field && input.filter) {
      query = query.where(`hearing.${input.field} like :search`, {
        search: `%${input.filter}%`,
      });
    }
    let results = await query
      .skip(input.skip)
      .limit(input.limit)
      .addOrderBy(`hearing.${input.orderField}`, input.order)
      .getMany();
    return results;
  }

  @Query(() => SenateHearing)
  async findSenateHearing(@Arg("id") id: string) {
    let result = await SenateHearing.findOne({ id });
    return result;
  }

  @Mutation(() => String)
  async deleteSenateHearing(@Arg("id") id: string) {
    await SenateHearing.delete({ id });
    return id;
  }

  @Mutation(() => SenateHearing)
  async addSenateHearing(@Arg("input") input: HearingInput) {
    let result = await SenateHearing.create(input).save();
    return result;
  }
}

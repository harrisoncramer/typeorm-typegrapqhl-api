import { Query, Resolver, Mutation, Arg } from "type-graphql";
import { getRepository } from "typeorm";
import { SenateHearing } from "../entity/Hearing";
import {
  HearingInput,
  HearingModifyInput,
  SkipLimitFilterDateRangeInput,
} from "./common/Input";
import { findAndRemove, findOne } from "./common/Methods";

@Resolver()
export class SenateHearingResolver {
  @Query(() => [SenateHearing])
  async findSenateHearings(@Arg("input") input: SkipLimitFilterDateRangeInput) {
    let query = getRepository(SenateHearing).createQueryBuilder("hearing");
    if (input.field && input.filter) {
      query = query.where(`hearing.${input.field} like :search`, {
        search: `%${input.filter}%`,
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
      .addOrderBy(`hearing.${input.orderField}`, input.order)
      .getMany();
    return results;
  }

  @Mutation(() => SenateHearing)
  async modifySenateHearing(
    @Arg("id") id: string,
    @Arg("input") input: HearingModifyInput
  ) {
    const query = getRepository(SenateHearing).createQueryBuilder("hearing");
    await query
      .update(SenateHearing)
      .set({ ...input })
      .where("id = :id", { id })
      .execute();
    return await findOne(SenateHearing, id);
  }

  @Query(() => SenateHearing)
  async findSenateHearing(@Arg("id") id: string) {
    const result = findOne(SenateHearing, id);
    return result;
  }

  @Mutation(() => String)
  async deleteSenateHearing(@Arg("id") id: string) {
    await findAndRemove(SenateHearing, id);
    return id;
  }

  @Mutation(() => SenateHearing)
  async addSenateHearing(@Arg("input") input: HearingInput) {
    const result = await SenateHearing.create(input).save();
    return result;
  }
}

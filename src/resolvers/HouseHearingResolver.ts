import { Query, Resolver, Mutation, Arg } from "type-graphql";
import { getRepository } from "typeorm";
import { HouseHearing } from "../entity/Hearing";
import {
  SkipLimitFilterInput,
  HearingInput,
  HearingModifyInput,
} from "./common/Input";
import { findAndRemove, findOne } from "./common/Methods";

@Resolver()
export class HouseHearingResolver {
  @Query(() => [HouseHearing])
  async findHouseHearings(@Arg("input") input: SkipLimitFilterInput) {
    let query = getRepository(HouseHearing).createQueryBuilder("hearing");
    if (input.field && input.filter) {
      query = query.where(`hearing.${input.field} like :search`, {
        search: `%${input.filter}%`,
      });
    }

    let results = await query
      .offset(input.skip)
      .limit(input.limit)
      .addOrderBy(`hearing.${input.orderField}`, input.order)
      .getMany();
    return results;
  }

  @Mutation(() => HouseHearing)
  async modifyHouseHearing(
    @Arg("id") id: string,
    @Arg("input") input: HearingModifyInput
  ) {
    let query = getRepository(HouseHearing).createQueryBuilder("hearing");
    await query
      .update(HouseHearing)
      .set({ ...input })
      .where("id = :id", { id })
      .execute();
    return await HouseHearing.findOne({ id });
  }

  @Query(() => HouseHearing)
  async findHouseHearing(@Arg("id") id: string) {
    let result = findOne(HouseHearing, id);
    return result;
  }

  @Mutation(() => String)
  async deleteHouseHearing(@Arg("id") id: string) {
    await findAndRemove(HouseHearing, id);
    return id;
  }

  @Mutation(() => HouseHearing)
  async addHouseHearing(@Arg("input") input: HearingInput) {
    let result = await HouseHearing.create(input).save();
    return result;
  }
}

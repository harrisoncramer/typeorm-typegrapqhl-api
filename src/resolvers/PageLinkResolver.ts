import { Query, Resolver, Mutation, Arg, InputType, Field } from "type-graphql";
import { PageLink } from "../entity/PageLink";
import { findAndRemove, findOne } from "./common/Methods";

@InputType({ description: "Input type to add a page link." })
class PageLinkInput implements Partial<PageLink> {
  @Field()
  link: string;
}

@Resolver()
export class PageLinkResolver {
  @Query(() => [PageLink])
  async findPageLink(@Arg("id") id: string) {
    const result = await findOne(PageLink, id);
    return result;
  }

  @Mutation(() => String)
  async deletePageLink(@Arg("id") id: string) {
    await findAndRemove(PageLink, id);
    return id;
  }

  @Mutation(() => PageLink)
  async addPageLink(@Arg("input") input: PageLinkInput) {
    const result = await PageLink.create(input).save();
    return result;
  }
}

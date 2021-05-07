import {
  Query,
  Resolver,
  Mutation,
  Arg,
  InputType,
  Field,
  Ctx,
} from "type-graphql";
import { PageLink } from "../entity/PageLink";
import { User } from "../entity/User";
import { MyContext } from "../types/MyContext";

// Overload the Session type to allow us to add our own values
declare module "express-session" {
  interface Session {
    userId: string;
  }
}

@InputType({ description: "Input type to add a page link." })
class PageLinkInput implements Partial<PageLink> {
  @Field()
  link: string;
}

@Resolver()
export class PageLinkResolver {
  @Query(() => [PageLink], { nullable: true })
  async findPageLinks(@Ctx() ctx: MyContext): Promise<PageLink[] | null> {
    const user = await User.findOne(ctx.req.session.userId, {
      relations: ["pagelinks"],
    });
    if (!user) return null;
    return user.pagelinks;
  }

  @Query(() => PageLink, { nullable: true })
  async findPageLink(
    @Arg("id") id: string,
    @Ctx() ctx: MyContext
  ): Promise<PageLink | null> {
    const user = await User.findOne(ctx.req.session.userId, {
      relations: ["pagelinks"],
    });

    if (!user) return null;

    // Return pagelink that matches id
    return user.pagelinks.find((link) => link.id === id) || null;
  }

  @Mutation(() => String)
  async deletePageLink(
    @Arg("id") id: string,
    @Ctx() ctx: MyContext
  ): Promise<null | string> {
    const user = await User.findOne(ctx.req.session.userId, {
      relations: ["pagelinks"],
    });
    if (!user) return null;

    // Filter out matching id...
    // Cascade will delete pagelink
    user.pagelinks = user.pagelinks.filter((link) => link.id !== id);
    await user.save();
    return id;
  }

  @Mutation(() => PageLink)
  async addPageLink(
    @Arg("input") input: PageLinkInput,
    @Ctx() ctx: MyContext
  ): Promise<PageLink | null> {
    const user = await User.findOne(ctx.req.session.userId, {
      relations: ["pagelinks"],
    });
    if (!user) return null;

    // Create pagelink
    // Saving will automatically add it to the user's pagelinks.
    const pagelink = PageLink.create({ ...input, user });
    await pagelink.save();

    return pagelink;
  }
}

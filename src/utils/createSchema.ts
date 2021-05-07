import { buildSchema } from "type-graphql";

import { UserResolver } from "../resolvers/UserResolver";
import { PageLinkResolver } from "../resolvers/PageLinkResolver";

export const createSchema = async () =>
  buildSchema({
    resolvers: [UserResolver, PageLinkResolver],
    authChecker: ({ context: { req } }) => !!req.session.userId,
    validate: true,
  });

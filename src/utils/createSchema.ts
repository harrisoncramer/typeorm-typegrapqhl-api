import { buildSchema } from "type-graphql";

import { UserResolver, PageLinkResolver } from "../resolvers";

export const createSchema = async () =>
  buildSchema({
    resolvers: [UserResolver, PageLinkResolver],
    authChecker: ({ context: { req } }) => !!req.session.userId,
    validate: true,
  });

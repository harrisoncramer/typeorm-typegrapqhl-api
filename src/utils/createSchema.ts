import { buildSchema } from "type-graphql";

import { UserResolver } from "../resolvers";

export const createSchema = async () =>
  buildSchema({
    resolvers: [UserResolver],
    authChecker: ({ context: { req } }) => !!req.session.userId,
    validate: true,
  });

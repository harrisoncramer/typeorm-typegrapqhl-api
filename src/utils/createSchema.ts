import { buildSchema } from "type-graphql";

import {
  UserResolver,
  SenateDisclosureResolver,
  HouseDisclosureResolver,
  HouseHearingResolver,
  SenateHearingResolver,
} from "../resolvers";

export const createSchema = async () =>
  buildSchema({
    resolvers: [
      UserResolver,
      HouseDisclosureResolver,
      SenateDisclosureResolver,
      HouseHearingResolver,
      SenateHearingResolver,
    ],
    authChecker: ({ context: { req } }) => !!req.session.userId,
    validate: true,
  });

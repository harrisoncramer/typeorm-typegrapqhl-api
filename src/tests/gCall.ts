import { graphql, GraphQLSchema } from "graphql";
import { Maybe } from "graphql/jsutils/Maybe";
import { createSchema } from "../utils/createSchema";

interface Options {
  source: string;
  variableValues?: Maybe<{
    [key: string]: any;
  }>;
  userId?: string;
}

// Define schema up here so it only needs to be created once, not on every gCall.
let schema: GraphQLSchema;

export const gCall = async ({ source, variableValues, userId }: Options) => {
  if (!schema) {
    schema = await createSchema();
  }

  return graphql({
    schema,
    source,
    variableValues,
    contextValue: {
      // Mock values that are in our context because we don't have Express
      req: {
        session: {
          userId,
          destroy: async function (callback: () => Promise<boolean>) {
            await callback();
          },
        },
      },
      res: {
        clearCookie: function () {
          return null;
        },
      },
    },
  });
};

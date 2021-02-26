import { graphql } from "graphql";
import { Maybe } from "graphql/jsutils/Maybe";
import { createSchema } from "../utils/createSchema";

interface Options {
  source: string;
  variableValues?: Maybe<{
    [key: string]: any;
  }>;
}

// Allows us to make calls to our Graphql Schema inside our tests more easily
export const gCall = async ({ source, variableValues }: Options) => {
  return graphql({
    schema: await createSchema(),
    source,
    variableValues,
  });
};

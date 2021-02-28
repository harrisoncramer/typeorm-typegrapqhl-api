import { graphql, GraphQLSchema } from "graphql";
import { Maybe } from "graphql/jsutils/Maybe";
import { createSchema } from "../utils/createSchema";

interface Options {
  source: string;
  variableValues?: Maybe<{
    [key: string]: any;
  }>;
}

// Define schema up here so it only needs to be created once, not on every gCall.
let schema: GraphQLSchema;

// Higher order function that allows us to make calls to our Graphql Schema inside our tests more easily
export const gCall = async ({ source, variableValues }: Options) => {
  if (!schema) {
    schema = await createSchema();
  }
  return graphql({
    schema,
    source,
    variableValues,
  });
};

import "reflect-metadata";
import dotenv from "dotenv";
import { createConnection, getConnectionOptions } from "typeorm";
import express from "express";
import { ApolloServer as ApolloServerDev } from "apollo-server-express";
import { ApolloServer as ApolloServerProd } from "apollo-server-lambda";
import { buildSchema } from "type-graphql";
import { HelloWorldResolver } from "./resolvers/HelloWorldResolver";
import { DisclosureResolver } from "./resolvers/DisclosureResolver";

import { APIGatewayProxyEvent, Context, Callback } from "aws-lambda";

const environment = process.env.NODE_ENV;

// Connect to database, regardless of in development or production
const connectToDBAndBuildSchema = async () => {
  const options = await getConnectionOptions(environment || "development");
  const connection = await createConnection({ ...options, name: "default" });
  if (!connection.isConnected) {
    throw new Error("Could not connect to database!");
  }
  const schema = await buildSchema({
    resolvers: [HelloWorldResolver, DisclosureResolver],
    validate: true,
  });
  return { connection, schema };
};

// This function will only be run in production
// and exposes a handler function for our aws-lambda
// context to hit.
export const graphql = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback
) => {
  const { schema } = await connectToDBAndBuildSchema();
  const server = new ApolloServerProd({ schema });
  let handler = server.createHandler({
    cors: { origin: "*", credentials: false },
  });
  return handler(event, context, callback);
};

// If in development mode, run the application
// using apollo-server-express and ts-node locally
// for fast reload and quick DB connections
if (environment === "development") {
  (async () => {
    dotenv.config({ path: ".env.development" });
    const { schema } = await connectToDBAndBuildSchema();
    const app = express();
    const server = new ApolloServerDev({
      schema,
      context: ({ req, res }) => ({ req, res }),
    });
    server.applyMiddleware({ app, cors: false });
    app.listen(process.env.PORT, () => console.log("SERVER LISTENING..."));
  })();
}

import "reflect-metadata";
import { createConnection, getConnectionOptions } from "typeorm";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import {
  SenateDisclosureResolver,
  HouseDisclosureResolver,
  HouseHearingResolver,
  SenateHearingResolver,
} from "./resolvers";

(async () => {
  const app = express();

  const options = await getConnectionOptions(process.env.ENV);

  let retries = 5;
  while (retries) {
    try {
      await createConnection({ ...options, name: "default" });
      break;
    } catch (err) {
      // Retry every two seconds...
      console.error(err);
      retries -= 1;
      console.error(`Retries left ${retries}`);
      await new Promise((res) => setTimeout(res, 2000));
    }
  }

  const apolloServer = new ApolloServer({
    playground: process.env.ENV === "development",
    introspection: true,
    schema: await buildSchema({
      resolvers: [
        HouseDisclosureResolver,
        SenateDisclosureResolver,
        HouseHearingResolver,
        SenateHearingResolver,
      ],
      validate: true,
    }),
    context: ({ req, res }) => ({ req, res }),
  });

  apolloServer.applyMiddleware({ app, cors: true });
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`🔥 API exposed at http://localhost:${port}/graphql`);
  });
})();

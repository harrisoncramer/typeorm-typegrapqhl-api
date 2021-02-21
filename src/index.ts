import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { mySession } from "./redis";
import { connect } from "./postgres";
import cors from "cors";

import {
  UserResolver,
  SenateDisclosureResolver,
  HouseDisclosureResolver,
  HouseHearingResolver,
  SenateHearingResolver,
} from "./resolvers";

(async () => {
  const app = express();
  app.use(cors({ credentials: true, origin: "http://localhost:3000" })); // The URL of the ReactApp

  // Connect to PostgreSQL DB
  await connect();

  // Add session middleware for storing cookies with Redis
  app.use(mySession);

  // Create ApolloServer instance
  const apolloServer = new ApolloServer({
    playground: process.env.ENV === "development",
    introspection: true,
    schema: await buildSchema({
      resolvers: [
        UserResolver,
        HouseDisclosureResolver,
        SenateDisclosureResolver,
        HouseHearingResolver,
        SenateHearingResolver,
      ],
      authChecker: ({ context: { req } }) => !!req.session.userId,
      validate: true,
    }),
    context: ({ req }) => ({ req }),
  });

  // Apply Apollo and start up express application
  // Note: We listen on port 1234, but expose that on process.env.PORT in docker-compose
  apolloServer.applyMiddleware({ app, cors: true });
  app.listen(1234, () => {
    console.log(`🔥 API running in ${process.env.ENV}`);
    console.log(`🔬 http://localhost:${process.env.PORT}/graphql`);
  });
})();

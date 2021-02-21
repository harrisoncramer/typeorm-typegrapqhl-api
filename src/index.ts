import "reflect-metadata";
import { createConnection, getConnectionOptions, getConnection } from "typeorm";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import session from "express-session";
import connectRedis from "connect-redis";
import { redis } from "./redis";
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
  app.use(cors({ credentials: true, origin: "http://localhost:1234" })); // The URL of the ReactApp

  // Connect to PostgreSQL DB
  const options = await getConnectionOptions(process.env.ENV);
  let retries = 5;
  while (retries) {
    try {
      await createConnection({ ...options, name: "default" });
      break;
    } catch (err) {
      console.error(err);
      retries -= 1;
      console.error(`Retries left ${retries}`);
      await new Promise((res) => setTimeout(res, 5000));
    }
  }

  if (retries === 0 && !!getConnection()) {
    throw new Error("Not able to connect to PostgreSQL DB.");
  }

  // Create session middleware for JWTs using Redis
  const RedisStore = connectRedis(session);
  app.use(
    session({
      store: new RedisStore({
        client: redis,
      }),
      name: "qid",
      secret: process.env.SECRET || "wiuy10b1la",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365,
      },
    })
  );

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

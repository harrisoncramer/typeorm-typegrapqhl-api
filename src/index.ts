import "reflect-metadata";
import { createConnection, getConnectionOptions, getConnection } from "typeorm";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import {
  UserResolver,
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
      await new Promise((res) => setTimeout(res, 5000));
    }
  }

  if (retries === 0 && !!getConnection()) {
    throw new Error("Not able to connect");
  }

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
    context: ({ req }) => {
      // Add user to context if authenticated
      const _token = req.headers.authorization || "";
      const user = null; // getUser(token)
      return { user };
    },
  });

  apolloServer.applyMiddleware({ app, cors: true });
  app.listen(1234, () => {
    console.log(
      `🔥 API exposed in ${process.env.ENV} at http://localhost:${process.env.PORT}/graphql` // This is what the port will be mapped to
    );
  });
})();

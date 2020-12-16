# 🚀 Dockerized TypeORM API w/ Apollo

This is a GraphQL API that connects to SQLite in development and Postgres in production. Dockerized for faster deployment.

## Installation

This application uses `docker-compose` to ensure a consistent environment for the API. Running it in either development or production requires just a few steps:

1. Define your variables for development inside a `.env.development` file, and for production inside a `.env.production` file. Look at the `modules.d.ts` to see what is required configuration for your production environment (basically just PostgresSQL connection options). The `.env.development` file only needs to contain the port number.

For example in development, since we use sqllite and don't need to configure PostgresSQL connection options, simply specify:

```
PORT=3122
ENV=development
```

In production, you'll need to pass more configuration variables that will allow TypeORM to connect to your database. These will be passed into the `ormconfig.js` file at runtime.

2. Run the `ENV=prodcution docker-compose up` inside your root directory; and `ENV=development docker-compose up` for development.

## Playground

This will run your application and open it on the port you specify. The API will then be accessible on that port, at the `/graphql` endpoint. For example, the final API endpoint might be: `http://localhost:3000/graphql` on your host machine.

The

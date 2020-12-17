# 🚀 Dockerized TypeORM API w/ Apollo

This is a GraphQL API that connects to SQLite in development and Postgres in production. Dockerized for faster deployment.

## Installation

This application uses `docker-compose` to ensure a consistent environment for the API. Running it in either development or production requires just a few steps:

1. Define your additional variables for development inside a `.env.development` file, and for production inside a `.env.production` file. Look at the `modules.d.ts` to see what is required configuration for your production environment (basically just PostgresSQL connection options). By default, the `.env.development` file does not need any arguments, however it must exist. By default, the API will run on port 3122 and map to the same port on your host system.

NOTE: In development, since we use sqllite and don't need to configure PostgresSQL connection options. In production, you'll need to pass more configuration variables that will allow TypeORM to connect to your database. These will be passed into the `ormconfig.js` file at runtime.

2. Run the `ENV=production PORT=1234 docker-compose up -d` inside your root directory; and `ENV=development PORT=1234 docker-compose up` for development.

3. If you'd like to startup a PostgresSQL server locally in production, you can do that too! Add the `docker-compose.pg.yml` file to your startup script: `ENV=production PORT=1234 docker-compose -f docker-compose.yml -f docker-compose.pg.yml up -d`

Be sure that your connection options in your `.env.production` file point to your local PostgresSQL server if you do this!

## Playground

The application will open up a playground on the port you specify in development mode. The API will then be accessible on that port, at the `/graphql` endpoint. For example, the final API endpoint might be: `http://localhost:1234/graphql` on your host machine.

You can easily test the DB with the following mutation:

```
mutation {
  addHouseHearing(
    input: {
      title: "hi"
      date: "2020-12-16T23:56:29.931Z"
      time: "2020-12-16T23:56:29.931Z"
      location: "a"
      text: ""
      chamber: "house"
      committee: "hfac"
      link: "google.com"
    }
  ) {
    id
  }
}
```

This should return the ID of the new data. Congratulations, your database and API are up and running!

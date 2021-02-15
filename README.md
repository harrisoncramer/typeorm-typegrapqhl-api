# 🚀 Dockerized TypeORM API w/ Apollo

This is a GraphQL API that connects to SQLite in development and Postgres in production. Dockerized for faster deployment.

## Installation

This application uses `docker-compose` to ensure a consistent environment for the API. Running it in either development or production requires just a few steps:

1. Define any additional variables for development inside a `.env.development` file, and for production inside a `.env.production` file. Look at the `modules.d.ts` to see what is required configuration for your production environment (basically just PostgresSQL connection options). By default, the `.env.development` file only requires the `PORT` on which the API will be exposed on your local machine.

NOTE: In production, you'll need to pass more configuration variables that will allow TypeORM to connect to your remote database. These will be passed into the `ormconfig.js` file at runtime. Presumably you do not want your database dockerized with this application, although that is possible, and indeed how this is built for development. See the `docker-compose.dev.yml` file for more information.

2. Run the following command to expose the API on Port 1234 on your local machine: `PORT=1234 -f docker-compose -f docker-compose.dev.yml up`

You can run the server in detached mode as well. Note that the first time you run this command, docker will have to pull down all the source code needed for the PostgresSQL server, Linux machine, and NPM packages. The entire bundle will take up around 500 MB.

## Playground

In development, the API will be accessible at the `http://localhost:1234/graphql` endpoint. You can easily test the DB with the following mutation:

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

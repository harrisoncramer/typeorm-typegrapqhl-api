# 🚀 Dockerized TypeORM API w/ Apollo

This is a GraphQL API that connects to SQLite in development and Postgres in production. Dockerized for faster deployment.

## Installation

`yarn install`

## Development

To spin up the development server locally, run `yarn start` which will open the grqphql playground on the port that you specify inside the `.env.development` file. In development (since we're using SQLite) the only environment variable required is the PORT.

## Production

This application is dockerized, and deployment requires that you build and push the image to a repository. On your host machine, you must create a `.env.production` file that adheres to the standard specified inside the `modules.d.ts` file (the typing inside that file doesn't really matter as all environment variables picked up by node are considered strings)

The required production arguments to the `docker run` command are as follows (assuming you use port 3000 inside your `.env.production` file for the the container's port):

`docker run -dit -p desired-port-exposed:3000 --env-file .env.production name-of-your-built-image`

This will run your application and open it on the port you specify for "desired-host-port." The API will then be accessible on that port, at the endpoint `/graphql`

For example, the final endpoint might look like: `145.10.10.93:1234/graphql` on your host machine.

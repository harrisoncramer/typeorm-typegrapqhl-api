# 🚀 TypeORM + Type-graphQL API

This is the API that connects to sqllite in development and postgres on AWS (RDS) in production

## Installation

`yarn install`

## Development

To spin up the development server locally, run `yarn start` which will open the grqphql playground on the port that you specify. In development (since we're using sqllite) the only `.env` required is the PORT.

## Deployment

This API will run on a server like DigitalOcean or EC2. There's no automated deployment process at this point.

Required environment variables for the production environment (which connect to PostgresSQL or another SQL database in AWS) can be found in the `modules.d.ts` file.

# 🚀 Dockerized TypeORM API w/ Apollo

This is a template GraphQL/TypeORM/PostgresSQL API. The application uses docker-compose in development and can be deployed with Kubernetes in production.

## Development

1. Define any additional development variables inside a `.env.development` file. By default, the `.env.development` file doesn't require any variables, but it must exist.
2. Install your dependencies locally: `npm install`
3. You can start up the server with the `./dock dev start` by using the supplied bash script. Alternatively, run the `docker-compose` command by hand: `PORT=1451 docker-compose -f docker-compose.dev.yml up` which will run your API locally, and expose it on `http://localhost:1451/graphql`

## Testing

1. Define any additional variables inside a `.env.test` file. By default, the `.env.test` file doesn't require any variables, but it must exist.
2. Run tests with the `./dock test start` command, or run the `docker-compose` command by hand: `docker-compose -f docker-compose.test.yml run --rm api_test`

## Production

This application is designed to be run through kubernetes. The configuration files are stored inside the `infrastructure` folder. There is a separate readme for configuring your cluster contained in that folder.

## Installing NPM Packages

1. Install in the container `docker exec typeorm-api npm install PACKAGE_NAMES`
2. Install the packages locally with `npm install` (no need to specify the packages, because they will get picked up in your package.json file)

Note that you will have to `exec` install in your test container for the packages to be used there as well. Yes, this is clunkier than volume mounting. But the danger there is that you install a binary on your local machine (windows/mac) which won't work in the container.

## Logs

Use the `./dock dev logs` command to follow the logs in development (they'll be hidden if you start your development server with the `--detached` flag).

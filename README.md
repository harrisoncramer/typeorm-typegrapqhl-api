# 🚀 Dockerized TypeORM API w/ Apollo

This is a template GraphQL/TypeORM/PostgresSQL API. The application uses docker-compose in development and can be deployed with Kubernetes in production.

## Development

1. Define any additional development variables inside a `.env.development` file. By default, the `.env.development` file doesn't require any variables, but it must exist.
2. You can start up the server with the `./dock dev start` by using the supplied bash script. Alternatively, run the `docker-compose` command by hand: `PORT=1451 docker-compose -f docker-compose.dev.yml up` which will run your API locally, and expose it on `http://localhost:1451/graphql`

## Testing

1. Define any additional variables inside a `.env.test` file. By default, the `.env.test` file doesn't require any variables, but it must exist.
2. Run tests with the `./dock test start` command, or run the `docker-compose` command by hand: `docker-compose -f docker-compose.test.yml run --rm api_test`

## Production

This application is designed to be run through kubernetes. The configuration files are stored inside the `infrastructure` folder.

1. Run the redis deployment to setup an instance of Redis: `kubectl apply -f infrastructure/redis.kube.yaml`
2. Create the secret to pass to your production deployment: `kubectl create secret generic typeorm-config --from-env-file .env.production`
3. Deploy a production version of the application (pulling from docker hub): `kubectl apply -f infrastructure/deployment.kube.yaml`

Note that the Redis deployment should be started first. In order to redeploy an updated version of your application to production, you can rebuild it and then restart your application:

1. First, rebuild the image: `docker build . --tag yourDockerUsername/typeorm`
2. Then restart the deployment (which pulls the new image automatically): `kubectl rollout restart deployment typeorm`

You can change the production environment secrets, and then restart the server for them to take effect:

1. First, update the secret: `kubectl create secret generic typeorm-config --from-env-file .env.production --dry-run -o yaml | kubectl apply -f -`
2. Then restart the deployment: `kubectl rollout restart deployment typeorm`

By default, the application is not configured to connect to a local PostgresSQL instance, but rather connect to a managed external PostgresSQL instance, like [Amazon RDS](https://aws.amazon.com/rds/postgresql/) for PostgresSQL. The connection configuration options are indicated in the `modules.d.ts` file.

## Installing NPM Packages

1. Install in the container `docker exec typeorm-api npm install PACKAGE_NAMES`
2. Install the packages locally with `npm install` (no need to specify the packages, because they will get picked up in your package.json file)

Note that you will have to `exec` install in your test container for the packages to be used there as well.

## Logs

Use the `./dock dev logs` command to follow the logs in development (they'll be hidden if you start your development server with the `--detached` flag).

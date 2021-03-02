# 🚀 Dockerized TypeORM API w/ Apollo

This is a template GraphQL/TypeORM/PostgresSQL API, dockerized for quick deployment.

In order to open the API up for the world in production you'll need to open up port `80` on your server, which Nginx will proxy to your API. For more information check out [this](https://aws.amazon.com/premiumsupport/knowledge-center/connect-http-https-ec2/) article on setting security group permissions.

## Development

1. Define any additional variables for development inside a `.env.development` file. By default, the `.env.development` file doesn't require any variables, but must exist.
2. You can start up the server with the `./dock dev start` by using the supplied bash script. Alternatively, run the `docker-compose` command by hand: `PORT=1451 docker-compose -f docker-compose.dev.yml up` which will run your API locally, and expose it on `http://localhost:1451/graphql`

## Testing

1. Define any additional variables inside a `.env.test` file. By default, the `.env.test` file doesn't require any variables, but must exist.
2. Run tests with the `./dock test start` command, or run the `docker-compose` command by hand: `docker-compose -f docker-compose.test.yml run --rm api_test`

## Production

1. If you're running this on EC2 (or another cloud provider with minimal configuration) you'll need docker-compose and docker (and git). Run the `user.sh` script to create a new user.\*\* Login to your new user and then run the `setup.sh` script to download and configure docker and docker-compose.
2. Define configuration variables that will allow TypeORM to connect to your remote database, inside a `.env.production` file. These will be passed into the `ormconfig.js` file at runtime. Presumably you do not want your database dockerized with this application, although that is possible, and indeed how this is built for development. See the `docker-compose.dev.yml` file for more information. Look at the `modules.d.ts` to see what is required configuration for your production environment (basically just PostgresSQL connection options).
3. Run the `./dock prod start` command, or run the `docker-compose` command by hand: `docker-compose -f docker-compose.prod.yml up -d` which will run your service in detached mode. You cannot set the port from the command line because the Nginx file reverse proxies traffic to port `1234` but you could replace this number across the project if you want to use a different port.

## Installing NPM Packages

This application is designed to run entirely on the docker instance.

and you should only install packages locally to your `node_modules` folder after you install them in the instance. To make this easier, use the `./dock dev install` shortcut while you've got a unn, or run the commands manually (you'll have to rebuild your images for testing and production):

1. Install in the container `docker exec typeorm-api npm install PACKAGE_NAME`
2. Install the packages locally with `npm install` (no need to specify the packages, because they will get picked up in your package.json file)

## Logs

Use the `./dock dev logs` command to follow the logs in development (they'll be hidden if you start your development server with the `--detached` flag).

\*\* Note that if you are starting with a clean install, you may want to switch into the user's home folder. You may not have privileges to edit the folder you're currently in (probably owned by ubuntu). You will likely also have to change the ownership of the directory if you originally downloaded it with `ubuntu` like this: `sudo chown -R username:username .` from inside the directory.

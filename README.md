# 🚀 Dockerized TypeORM API w/ Apollo

This is a template GraphQL/TypeORM/PostgresSQL API, dockerized for quick deployment.

This application uses `docker-compose` to ensure a consistent environment for the API. Installation can be helped along (if you're starting with a fresh Ubuntu instance on AWS, for instance) with the startup scripts contained in the `scripts` folder.\*\*

In production in order to open the API up for the world you'll also need to open up port 80, which Nginx will proxy to your API. For more information check out [this](https://aws.amazon.com/premiumsupport/knowledge-center/connect-http-https-ec2/) article on setting security group permissions.

## Development

1. Define any additional variables for development inside a `.env.development` file. By default, the `.env.development` file doesn't require any variables, but must exist.
2. Run the `docker-compose` command to start up your instance: `PORT=1451 docker-compose -f docker-compose.dev.yml up` which will run your API locally, and expose it on `http://localhost:1451/graphql`

## Testing

1. Define any additional variables inside a `.env.test` file. By default, the `.env.development` file doesn't require any variables, but must exist.
2. Run the `docker-compose` command to start up your `jest` test suite (by default you must have port `9876` open): `docker-compose -f docker-compose.test.yml run api`

## Production

1. If you're running this on EC2 (or another cloud provider with minimal configuration) you'll need docker-compose and docker (and git). Run the `user.sh` script to create a new user.\*\* Login to your new user and then run the `setup.sh` script to download and configure docker and docker-compose.
2. Define configuration variables that will allow TypeORM to connect to your remote database, inside a `.env.production` file. These will be passed into the `ormconfig.js` file at runtime. Presumably you do not want your database dockerized with this application, although that is possible, and indeed how this is built for development. See the `docker-compose.dev.yml` file for more information. Look at the `modules.d.ts` to see what is required configuration for your production environment (basically just PostgresSQL connection options).
3. Run the `docker-compose` command: `docker-compose -f docker-compose.prod.yml up -d` which will run your service in detached mode. You cannot set the port from the command line because the Nginx file reverse proxies traffic to port `1234` but you could replace this number across the project if you want to use a different port.

## Installing NPM Packages

This application is designed to run entirely on the docker instance, and you should only install packages locally to your `node_modules` folder after you install them in the instance.

1. Install the new `npm` package in the container `docker exec typeorm-api npm install PACKAGE_NAME`
2. Install the packages locally by running `npm install` (no need to specify the packages, because they will get picked up in your package.json file)

## Logs

The application automatically sends out information to the console, which in development and production will automatically be output to docker's logs. You can see the last hour of logs from an instance with the `docker logs CONTAINER_ID --since 60m` command, for example.

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

\*\* Note that if you are starting with a clean install, you may want to switch into the user's home folder. You may not have privileges to edit the folder you're currently in (probably owned by ubuntu). You will likely also have to change the ownership of the directory if you originally downloaded it with `ubuntu` like this: `sudo chown -R username:username .` from inside the directory.

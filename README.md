# 🚀 Dockerized TypeORM API w/ Apollo

This is a template GraphQL/TypeORM/PostgresSQL API, dockerized for quick deployment.

## Setup

This application uses `docker-compose` to ensure a consistent environment for the API. Running it in either development or production requires just a few steps. Some of the installation can be helped along (if you're starting with a fresh Ubuntu instance on AWS, for instance) with the startup scripts contained in the `scripts` folder.**

In production in order to open the API up for the world you'll also need to open up port 80, which Nginx will proxy to your API. For more information check out [this](https://aws.amazon.com/premiumsupport/knowledge-center/connect-http-https-ec2/) article on setting security group permissions.

### Development

1. Define any additional variables for development inside a `.env.development` file. By default, the `.env.development` file only requires the `PORT` on which the API will be exposed on your local machine.
2. Run the `docker-compose` script to start up your instance: `docker-compose docker-compose.yml -f docker-compose.dev.yml up` which will run your API locally. Take note that if you're running this for the first time, it'll take a few minutes to download the images and install all the dependencies. Subsequent startups will be fast. The entire bundle is ~500MB.

### Production

1. If you're running this on EC2 (or another cloud provider with minimal configuration) you'll need docker-compose and docker (and git). Run the `user.sh` script to create a new user.** Login to your new user and then run the `setup.sh` script to download and configure docker and docker-compose.
2. Define configuration variables that will allow TypeORM to connect to your remote database, inside a `.env.production` file. These will be passed into the `ormconfig.js` file at runtime. Presumably you do not want your database dockerized with this application, although that is possible, and indeed how this is built for development. See the `docker-compose.dev.yml` file for more information. Look at the `modules.d.ts` to see what is required configuration for your production environment (basically just PostgresSQL connection options).
3. Run the `docker-compose` command: `docker-compose docker-compose.yml -f docker-compose.prod.yml up -d` which will run your service in detached mode.

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


** Note that if you are starting with a clean install, you'll want to switch into the user's home folder and re-download this repository, because you probably won't able to edit the folder you're currently in (probably owned by ubuntu).

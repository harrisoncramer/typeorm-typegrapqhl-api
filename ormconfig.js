// This application will run SQLLite in development by default and PostgresQL in production.
// Although you can technically run the docker-compose.pg.yml file in development, by default
// your API will not connect to that server. You must edit the configuration file below if you'd
// like to connect to the local PostgresQL development server by default.
module.exports = [
  {
    name: "development",
    type: "postgres",
    host: "db",
    port: 5432,
    password: "postgres",
    username: "postgres",
    database: "postgres",
    synchronize: true, // switch this to false once you have the initial tables created and use migrations instead
    logging: false,
    entities: ["./dist/entity/*.js"],
    migrations: ["./dist/migration/*.js"],
    subscribers: ["./dist/subscriber/*.js"],
  },
  {
    name: "production",
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    password: process.env.POSTGRES_PASSWORD,
    username: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    synchronize: true, // switch this to false once you have the initial tables created and use migrations instead
    logging: false,
    entities: ["./dist/entity/*.js"],
    migrations: ["./dist/migration/*.js"],
    subscribers: ["./dist/subscriber/*.js"],
  },
];

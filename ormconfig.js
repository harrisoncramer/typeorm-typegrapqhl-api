module.exports = [
  {
    name: "development",
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: true,
    entities: ["src/entity/**/*.ts"],
    migrations: ["src/migration/**/*.ts"],
    subscribers: ["src/subscriber/**/*.ts"],
    cli: {
      entitiesDir: "src/entity",
      migrationsDir: "src/migration",
      subscribersDir: "src/subscriber",
    },
  },
  {
    name: "production",
    type: "postgres",
    host: process.env.PSQL_HOST,
    port: process.env.PSQL_PORT,
    password: process.env.PSQL_PASSWORD,
    username: process.env.PSQL_USERNAME,
    database: process.env.PSQL_DATABASE,
    synchronize: true, // switch this to false once you have the initial tables created and use migrations instead
    logging: false,
    entities: ["./dist/entity/*.js"],
    migrations: ["./dist/migration/*.js"],
    subscribers: ["./dist/subscriber/*.js"],
  },
];

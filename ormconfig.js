module.exports = [
  {
    name: "development",
    type: "postgres",
    host: "db",
    port: 5432,
    password: "postgres",
    username: "postgres",
    database: "postgres",
    synchronize: true,
    logging: false, // Turn on if you want to see the PSQL queries
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
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    password: process.env.POSTGRES_PASSWORD,
    username: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    synchronize: false, // switch this to false once you have the initial tables created and use migrations instead
    logging: false,
    entities: ["./dist/entity/*.js"],
    migrations: ["./dist/migration/*.js"],
    subscribers: ["./dist/subscriber/*.js"],
  },
];

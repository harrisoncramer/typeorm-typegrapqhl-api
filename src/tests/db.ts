import { createConnection } from "typeorm";

export const db = (drop: boolean = false) =>
  createConnection({
    name: "test",
    type: "postgres",
    host: "db",
    port: 5432,
    password: "postgres",
    username: "postgres",
    database: "postgres", // Will this db exist...?
    logging: false,
    entities: [__dirname + "/../entity/**/*.ts"],
    migrations: [__dirname + "/../migration/**/*.ts"],
    subscribers: [__dirname + "/../subscriber/**/*.ts"],
    synchronize: drop,
    dropSchema: drop, // Clears out data after initial
  });

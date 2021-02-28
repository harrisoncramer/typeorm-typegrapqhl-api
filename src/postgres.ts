import {
  createConnection,
  getConnectionOptions,
  getConnection,
  //getConnectionManager,
} from "typeorm";

export const connect = async () => {
  // Connect to PostgreSQL DB
  const options = await getConnectionOptions(process.env.ENV);
  let retries = 5;

  while (true) {
    try {
      const db = await createConnection({ ...options, name: "default" });
      return db;
    } catch (err) {
      retries -= 1;
      console.error(`Retries left ${retries}`);
      if (retries === 0 && !!getConnection()) {
        throw new Error("Not able to connect to PostgreSQL DB.");
      }
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
};

import { createConnection, getConnectionOptions, getConnection } from "typeorm";

export const connect = async () => {
  // Connect to PostgreSQL DB
  const options = await getConnectionOptions(process.env.ENV);
  let retries = 5;
  while (retries) {
    try {
      await createConnection({ ...options, name: "default" });
      break;
    } catch (err) {
      console.error(err);
      retries -= 1;
      console.error(`Retries left ${retries}`);
      await new Promise((res) => setTimeout(res, 5000));
    }
  }

  if (retries === 0 && !!getConnection()) {
    throw new Error("Not able to connect to PostgreSQL DB.");
  }
};

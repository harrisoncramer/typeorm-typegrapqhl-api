import { db } from "../tests/db";
import { Connection } from "typeorm";

let conn: Connection;
beforeAll(async () => {
  conn = await db();
});

afterAll(async () => {
  await conn.close();
});

describe("User resolver", () => {
  it("Should succeed", async () => {
    console.log("Working!");
    return "OK";
  });
});

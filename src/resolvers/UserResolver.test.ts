import { connect } from "../postgres";
import { Connection } from "typeorm";
import { gCall } from "../tests/gCall";

let conn: Connection;
beforeAll(async () => {
  conn = await connect();
});

afterAll(async () => {
  await conn.close();
});

const registerMutation = `
mutation Register($input: UserInput!) {
  register(
    input: $input
  ) {
    id
    email
  }
}
`;

describe("User resolver", () => {
  it("Should succeed", async () => {
    const response = await gCall({
      source: registerMutation,
      variableValues: {
        input: {
          name: "bob3",
          email: "bob3@bob.com",
          password: "asdfasdf",
        },
      },
    });

    // Check that response matches what we'd expect...
  });
});

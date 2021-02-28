import { connect } from "../postgres";
import { Connection } from "typeorm";
import { gCall } from "../tests/gCall";
import faker from "faker";

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
    name
    email
  }
}
`;

describe("User resolver", () => {
  const user = {
    name: faker.name.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  const userInvalidEmail = {
    name: faker.name.firstName(),
    email: "notemail",
    password: faker.internet.password(),
  };

  const userInvalidPassword = {
    name: faker.name.firstName(),
    email: faker.internet.email(),
    password: "weak",
  };

  it("Should register user with valid credentials.", async () => {
    const response = await gCall({
      source: registerMutation,
      variableValues: {
        input: user,
      },
    });

    expect(response).toMatchObject({
      data: {
        register: {
          name: user.name,
          email: user.email,
        },
      },
    });
  });

  it("Should reject user with invalid email.", async () => {
    const response = await gCall({
      source: registerMutation,
      variableValues: {
        input: userInvalidEmail,
      },
    });

    console.log(JSON.stringify(response));
    // Check that response matches what we'd expect...
  });

  it("Should reject user with invalid password.", async () => {
    const response = await gCall({
      source: registerMutation,
      variableValues: {
        input: userInvalidPassword,
      },
    });

    console.log(JSON.stringify(response));
    // Check that response matches what we'd expect...
  });
});

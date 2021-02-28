import { connect } from "../postgres";
import { Connection } from "typeorm";
import { gCall } from "../tests/gCall";
import faker from "faker";
import { User } from "../entity";
import { ArgumentValidationError } from "type-graphql";

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

const unregisterMutation = `
mutation Unregister($email: String! $password: String!) {
  unregister(
    email: $email
    password: $password
  )
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
    password: "hi",
  };

  const userPwnedPassword = {
    name: faker.name.firstName(),
    email: faker.internet.email(),
    password: "123456789",
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

    const dbUser = await User.findOne({ where: { email: user.email } });
    expect(dbUser!.name).toBe(user.name);
  });

  it("Should reject user with invalid email.", async () => {
    const response = await gCall({
      source: registerMutation,
      variableValues: {
        input: userInvalidEmail,
      },
    });

    const error = response.errors![0].originalError;
    expect(error).toBeInstanceOf(ArgumentValidationError);
    const dbUser = await User.findOne({
      where: { email: userInvalidEmail.email },
    });
    expect(dbUser).toBeUndefined();
  });

  it("Should reject email already signed up.", async () => {
    await gCall({
      source: registerMutation,
      variableValues: {
        input: user,
      },
    });

    const response = await gCall({
      source: registerMutation,
      variableValues: {
        input: user,
      },
    });
    const error = response.errors![0].originalError;
    expect(error).toBeInstanceOf(ArgumentValidationError);
    const dbUser = await User.findOne({
      where: { email: userInvalidEmail.email },
    });
    expect(dbUser).toBeUndefined();
  });

  it("Should reject user with invalid password.", async () => {
    const response = await gCall({
      source: registerMutation,
      variableValues: {
        input: userInvalidPassword,
      },
    });

    const error = response.errors![0].originalError;
    expect(error).toBeInstanceOf(ArgumentValidationError);
    const dbUser = await User.findOne({
      where: { email: userInvalidPassword.email },
    });
    expect(dbUser).toBeUndefined();
  });

  it("Should reject user with common password (that's easily hacked).", async () => {
    const response = await gCall({
      source: registerMutation,
      variableValues: {
        input: userPwnedPassword,
      },
    });

    const error = response.errors![0].originalError;
    expect(error).toBeInstanceOf(ArgumentValidationError);
    const dbUser = await User.findOne({
      where: { email: userInvalidPassword.email },
    });
    expect(dbUser).toBeUndefined();
  });

  it("Should unregister user", async () => {
    await gCall({
      source: registerMutation,
      variableValues: {
        input: user,
      },
    });

    await gCall({
      source: unregisterMutation,
      variableValues: {
        email: user.email,
        password: user.password,
      },
    });

    const dbUser = await User.findOne({
      where: { email: user.email },
    });
    expect(dbUser).toBeUndefined();
  });

  it("Should not unregister user with wrong password", async () => {
    await gCall({
      source: registerMutation,
      variableValues: {
        input: user,
      },
    });

    const response = await gCall({
      source: unregisterMutation,
      variableValues: {
        email: user.email,
        password: "wrongone",
      },
    });

    expect(response.data!.unregister).toBeNull();

    const dbUser = await User.findOne({
      where: { email: user.email },
    });
    expect(dbUser!.name).toBe(user.name);
  });
});

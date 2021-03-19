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

const generateUser = () => ({
  name: faker.name.firstName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

// Mutations + Queries
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

const logout = `
  mutation {
    logout
  }
`;

const login = `
mutation Login($email: String! $password: String!) {
  login(
    email: $email
    password: $password
  ) {
      name
      email
    }
  }
`;

const meQuery = `
  {
    me {
      id
      name
      email
    }
  }
`;

const forgotPassword = `
mutation ForgotPassword($email: String!){
  forgotPassword(email: $email)
}
`;

//const changePassword = `
//mutation ChangePassword($input: ChangePasswordInput) {
//changePassword($input){
//id
//name
//email
//}
//}
//`

// Tests
describe("Registering + Unregistering", () => {
  it("Should register user with valid credentials.", async () => {
    const user = generateUser();
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
    const userInvalidEmail = { ...generateUser(), email: "notanemail" };
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
    const user = generateUser();
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
  });

  it("Should reject user with invalid password.", async () => {
    const userInvalidPassword = { ...generateUser(), password: "1234" };
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
    const userPwnedPassword = { ...generateUser(), password: "123456789" };
    const response = await gCall({
      source: registerMutation,
      variableValues: {
        input: userPwnedPassword,
      },
    });

    const error = response.errors![0].originalError;
    expect(error).toBeInstanceOf(ArgumentValidationError);
    const dbUser = await User.findOne({
      where: { email: userPwnedPassword.email },
    });
    expect(dbUser).toBeUndefined();
  });

  it("Should unregister user", async () => {
    const user = generateUser();
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
    const user = generateUser();
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

describe("Getting information about myself", () => {
  it("Should get current user", async () => {
    const user = await User.create({
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }).save();

    const response = await gCall({
      source: meQuery,
      userId: user.id,
    });

    expect(response.data).toMatchObject({
      me: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  });
  it("Should not get user without ID in current context", async () => {
    await User.create({
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }).save();

    const response = await gCall({
      source: meQuery,
    });

    expect(response.data).toMatchObject({ me: null });
  });
});

describe("Logging users in and out", () => {
  it("Should log me out", async () => {
    const user = await User.create({
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }).save();

    const response = await gCall({
      source: logout,
      userId: user.id,
    });

    expect(response.data).toMatchObject({
      logout: true,
    });
  });

  it("Should log me in", async () => {
    const user = generateUser();
    await gCall({
      source: registerMutation,
      variableValues: {
        input: user,
      },
    });

    const response = await gCall({
      source: login,
      variableValues: {
        email: user.email,
        password: user.password,
      },
    });

    expect(response.data).toMatchObject({
      login: {
        name: user.name,
        email: user.email,
      },
    });
  });
  it("Should not log me in with the wrong password", async () => {
    const user = generateUser();
    await gCall({
      source: registerMutation,
      variableValues: {
        input: user,
      },
    });

    const response = await gCall({
      source: login,
      variableValues: {
        email: user.email,
        password: "thewrongone",
      },
    });

    expect(response.data!.login).toBeNull();
  });
});

describe("Changing passwords", () => {
  it("Should let me get a link to change my password", async () => {
    const user = generateUser();

    await gCall({
      source: registerMutation,
      variableValues: {
        input: user,
      },
    });

    const res = await gCall({
      source: forgotPassword,
      variableValues: {
        email: user.email,
      },
    });

    expect(res.data!.forgotPassword).toBe(true);
  });
});

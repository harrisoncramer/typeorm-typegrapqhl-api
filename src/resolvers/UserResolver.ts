import { Resolver, Mutation, Arg } from "type-graphql";
import { User } from "../entity";
import bcryptjs from "bcryptjs";

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async register(
    @Arg("name") name: string,
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<User> {
    const hashed = await bcryptjs.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashed,
    }).save();

    return user;
  }
}

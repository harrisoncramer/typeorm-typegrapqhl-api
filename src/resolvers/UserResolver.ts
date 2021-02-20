import { Resolver, Mutation, Arg, InputType, Field } from "type-graphql";
import { User } from "../entity";
import bcryptjs from "bcryptjs";
import { IsEmail, Length } from "class-validator";

@InputType()
class UserInput {
  @Field()
  @Length(1, 255)
  name: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  password: string;
}

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async hello() {
    return "HI There!";
  }
  @Mutation(() => User)
  async register(@Arg("input") input: UserInput): Promise<User> {
    const { name, password, email } = input;
    const hashed = await bcryptjs.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashed,
    }).save();

    return user;
  }
}

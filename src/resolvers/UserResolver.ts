import {
  Resolver,
  Mutation,
  Query,
  Arg,
  InputType,
  Field,
  Ctx,
} from "type-graphql";
import { User } from "../entity";
import bcryptjs from "bcryptjs";
import { IsEmail, Length } from "class-validator";
import { IsEmailAlreadyExists } from "./validators/isEmailAlreadyInUse";
import { MyContext } from "../types/MyContext";

// Overload the Session type to allow us to add our own values
declare module "express-session" {
  interface Session {
    userId: string;
  }
}

@InputType()
class UserInput {
  @Field()
  @Length(1, 255, { message: "Name too long." })
  name: string;

  @Field()
  @IsEmail()
  @IsEmailAlreadyExists({ message: "That email already exists." })
  email: string;

  @Field()
  password: string;
}

@Resolver()
export class UserResolver {
  // Get current user based on session userId
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: MyContext): Promise<User | undefined> {
    if (!ctx.req.session.userId) return undefined;
    return User.findOne(ctx.req.session.userId);
  }

  // Login user
  @Mutation(() => User, { nullable: true })
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const user = await User.findOne({ where: { email } });
    if (!user) return null;

    const valid = await bcryptjs.compare(password, user.password);
    if (!valid) return null;

    // Set Cookie in session inside Redis
    ctx.req.session.userId = user.id;

    return user;
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

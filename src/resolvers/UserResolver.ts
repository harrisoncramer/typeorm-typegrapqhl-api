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
import { IsPasswordTooWeak } from "./validators/isPasswordTooWeak";
import { sendEmail } from "../utils/sendEmail";
import { createUrl } from "../utils/createUrl";
import { redis } from "../redisLogic";

// Overload the Session type to allow us to add our own values
declare module "express-session" {
  interface Session {
    userId: string;
  }
}

const forgotPasswordPrefix = "forgot-password";

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
  @IsPasswordTooWeak({ message: "That password is too simple." })
  password: string;
}

@InputType()
class ChangePasswordInput {
  @Field()
  token: string;

  @Field()
  password: string;
}

@Resolver()
export class UserResolver {
  // Get current user based on session userId
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: MyContext): Promise<User | undefined> {
    return User.findOne(ctx.req.session.userId);
  }

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

  @Mutation(() => User, { nullable: true })
  async changePassword(
    @Arg("input") { token, password }: ChangePasswordInput,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const userId = await redis.get(forgotPasswordPrefix + token);

    if (!userId) {
      return null; // We don't want to let someone know that our user was not found...
    }

    const user = await User.findOne(userId);
    if (!user) {
      return null;
    }

    redis.del(forgotPasswordPrefix + token);

    const hashed = await bcryptjs.hash(password, 12);
    user.password = hashed;

    redis.del(forgotPasswordPrefix + token);
    await user.save();

    // Log in the user automatically...
    ctx.req.session!.userId = user.id;

    return user;
  }

  @Mutation(() => Boolean)
  async forgotPassword(@Arg("email") email: string): Promise<boolean> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return true; // We don't want to let someone know that our user was not found...
    }

    const url = await createUrl(user.id, forgotPasswordPrefix);
    await sendEmail(email, url);

    return true;
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() ctx: MyContext): Promise<boolean> {
    return new Promise((res, rej) =>
      ctx.req.session!.destroy((err) => {
        // Remove Redis session
        if (err) {
          console.error(err);
          return rej(false);
        }

        // Remove cookie from the browser
        ctx.res.clearCookie("qid");
        return res(true);
      })
    );
  }

  @Mutation(() => Boolean, { nullable: true })
  async unregister(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<boolean | null> {
    const user = await User.findOne({ where: { email } });
    if (!user) return null;

    const valid = await bcryptjs.compare(password, user.password);
    if (!valid) return null;

    await user.remove();
    return true;
  }

  @Mutation(() => User)
  async register(
    @Arg("input") input: UserInput,
    @Ctx() ctx: MyContext
  ): Promise<User> {
    const { name, password, email } = input;
    const hashed = await bcryptjs.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashed,
    }).save();

    // Set Cookie in session inside Redis
    ctx.req.session.userId = user.id;

    return user;
  }
}

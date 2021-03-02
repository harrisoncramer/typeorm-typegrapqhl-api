import { v4 } from "uuid";
import { redis } from "../redisLogic";

export const createUrl = async (userId: string, prefix: string) => {
  const token = v4();
  await redis.set(prefix + token, userId, "ex", 60 * 60 * 1); // 1 Hour expiration
  return `http://localhost:3000/user/${prefix}/${token}`;
};

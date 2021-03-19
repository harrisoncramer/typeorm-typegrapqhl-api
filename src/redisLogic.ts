import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";

// Running Redis with docker-compose
let tries = 5;
const connectionOpts: Redis.RedisOptions = {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT as string) || 6379,
  retryStrategy: (time) => {
    if (tries === 0) {
      throw new Error("Could not connect to Redis.");
    } else {
      setTimeout(() => {
        tries--;
      }, time);
      return 2000;
    }
  },
};

// Connect to Redis
export const redis = new Redis(connectionOpts);

// Configure Redis to store session information
const RedisStore = connectRedis(session);

// Initialize session parameters and cookie name, etc.
export const mySession = session({
  store: new RedisStore({
    client: redis,
  }),
  name: "qid",
  secret: process.env.SECRET || "wiuy10b1la",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.SECURE_COOKIE === "true",
    maxAge: 1000 * 60 * 60 * 24 * 7 * 365,
  },
});

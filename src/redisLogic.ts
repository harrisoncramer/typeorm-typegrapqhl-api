import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";

// Running Redis with docker-compose
const connectionOpts = {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT as string) || 6379,
};

// Connect to Redis
const redis = new Redis(connectionOpts);

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
    secure: process.env.ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 7 * 365,
  },
});

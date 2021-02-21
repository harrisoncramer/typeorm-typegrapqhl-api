import Redis from "ioredis";

// Running Redis with docker-compose
const connectionOpts = {
  host: "redis",
  port: 6379,
};

export const redis = new Redis(connectionOpts);

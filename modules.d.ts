// Define types for our .env
declare namespace NodeJS {
  export interface ProcessEnv {
    SECRET: string;
    REDIS_HOST: string;
    REDIS_PORT: string;
    POSTGRES_HOST: string;
    POSTGRES_PORT: string;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_DB: string;
    USER_EMAIL: string;
    USER_PASSWORD: string;
    SECURE_COOKIE: string; // Take care, if serving over HTTP this should be "false"
  }
}

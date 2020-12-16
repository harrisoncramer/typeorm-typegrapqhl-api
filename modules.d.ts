// Define types for our .env
declare namespace NodeJS {
  export interface ProcessEnv {
    ENV: "development" | "production";
    PORT: "3122";
    PSQL_HOST: string;
    PSQL_PORT: string;
    PSQL_USERNAME: string;
    PSQL_PASSWORD: string;
    PSQL_DATABASE: string;
  }
}

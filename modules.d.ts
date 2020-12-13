// Define types for our .env
declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string;
    PSQL_HOST: string;
    PSQL_PORT: string;
    PSQL_USERNAME: string;
    PSQL_PASSWORD: string;
    PSQL_DATABASE: string;
  }
}

// Define types for our .env
declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: number;
    PSQL_HOST: string;
    PSQL_PORT: number;
    PSQL_USERNAME: string;
    PSQL_PASSWORD: string;
    PSQL_DATABASE: string;
  }
}

export interface ENV {
  HOST: string | undefined;
  PORT: number | undefined;
  NODE_ENV: string | undefined;
  CONTEXT_PATH: string | undefined;
  JWT_KEY: string | undefined;
  MONGO_URL: string | undefined;
  MAIL_USER: string | undefined;
  MAIL_PASS: string | undefined;
  API_QDRANT_URL: string | undefined;
  API_QDRANT_KEY: string | undefined;
}

import { config } from "dotenv";

config({ path: `${__dirname}/../../.env`, quiet: true });

export const databasePath = process.env.DATABASE_URL ?? "./data/facturation.db";
export const googleApiKey =
  process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? process.env.GOOGLE_KEY;

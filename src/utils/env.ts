import z from "zod";

const envSchema = z.object({
  NODE_ENV: z.string(),
  PORT: z.string(),
  CORS_ORIGIN: z.string(),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  COOKIE_SECRET: z.string(),
  ACCESS_TOKEN_NAME: z.string(),
  ACCESS_TOKEN_EXPIRES_IN: z.string(),
});

envSchema.safeParse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}

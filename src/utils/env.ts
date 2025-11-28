import z from "zod";

const env_schema = z.object({
  PORT: z.string(),
  CORS_ORIGIN: z.string(),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  COOKIE_SECRET: z.string(),
  ACCESS_TOKEN_NAME: z.string(),
  ACCESS_TOKEN_EXPIRES_IN: z.string(),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),

  NODE_ENV: z.enum(["development", "production", "test"]),
});

env_schema.safeParse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof env_schema> {}
  }
}

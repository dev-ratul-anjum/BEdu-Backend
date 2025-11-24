import z from 'zod'

const envSchema = z.object({
  PORT: z.string(),
  CORS_ORIGIN: z.string(),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  COOKIE_SECRET : z.string(),
})

envSchema.safeParse(process.env)

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}

import { PrismaClient } from '$/db/generated/client.ts'
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })

export const db = new PrismaClient({ adapter })

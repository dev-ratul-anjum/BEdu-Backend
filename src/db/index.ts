import { PrismaClient } from '$/db/generated/client.ts'
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const connectionString = process.env.DATABASE_URL

const adapter = new PrismaPg({ connectionString })
const db = new PrismaClient({ adapter })

export { db }

// import { PrismaClient } from './generated/client.ts'

// const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

// export const db = globalForPrisma.prisma || new PrismaClient()

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

import { config } from 'dotenv'
import { Pool } from 'pg'

config()

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
})

db.on('connect', () => {
  console.log('✅ Connected to PostgreSQL successfully!')
})

db.on('error', () => {
  console.error("❌ An unexpected error occured! can't connect to PostgreSQL")
})

export default db

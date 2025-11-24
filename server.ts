import app from '$/app.ts'
import { config } from 'dotenv'

config()
const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`🚀 Server is flying on http://localhost:${PORT}`)
})

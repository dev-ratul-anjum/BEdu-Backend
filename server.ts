import app from '$/app.ts'
import 'dotenv/config'

const PORT = process.env.PORT

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 Server started on http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('❌ Server failed to start:', err)
    process.exit(1)
  }
}

startServer()

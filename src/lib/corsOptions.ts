import { CorsOptions } from 'cors'

const corsOptions: CorsOptions = {
  origin: '*',
  credentials: true,
  methods: ['POST', 'GET', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'User-Agent'],
}

export default corsOptions

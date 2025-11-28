import { CorsOptions } from 'cors'

const cors_options: CorsOptions = {
  origin: '*',
  credentials: true,
  methods: ['POST', 'GET', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'User-Agent'],
}

export default cors_options

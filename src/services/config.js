export const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://portal.baltichome.pl/api'
  : 'http://localhost:8000/api';
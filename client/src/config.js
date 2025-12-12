// API Configuration
const isDevelopment = import.meta.env.MODE === 'development';

// Relative path automatically works for both:
// 1. Development (via vite proxy -> localhost:5000)
// 2. Production (served by server -> same domain)
export const API_URL = '/api';

// Image URL base (relative)
export const IMAGE_URL = '';

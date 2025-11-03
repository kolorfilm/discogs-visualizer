import { config } from 'dotenv';

// Load .env for server-side code (Express server)
config();

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  turbopack: {},
};

export default nextConfig;

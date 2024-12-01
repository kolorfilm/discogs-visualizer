import path from 'path';
import Dotenv from 'dotenv-webpack';
import { config } from 'dotenv';

config();

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  webpack: (config) => {
    config.plugins = [
      ...config.plugins,

      // Read the .env file
      new Dotenv({
        path: path.join(process.cwd(), '.env'),
        systemvars: true,
      }),
    ];

    return config;
  },
};

export default nextConfig;

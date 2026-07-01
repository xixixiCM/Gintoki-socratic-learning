import dotenv from 'dotenv';

dotenv.config();

const toNumber = (value: string | undefined, fallback: number): number => {
  if (value === undefined || value.trim() === '') {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: toNumber(process.env.PORT, 3001),
  apiPrefix: process.env.API_PREFIX ?? '/api',
  dbHost: process.env.DB_HOST ?? '127.0.0.1',
  dbPort: toNumber(process.env.DB_PORT, 3306),
  dbUser: process.env.DB_USER ?? 'root',
  dbPassword: process.env.DB_PASSWORD ?? 'your_mysql_password',
  dbName: process.env.DB_NAME ?? 'ai_socratic_learning',
  dbConnectionLimit: toNumber(process.env.DB_CONNECTION_LIMIT, 10),
  dbCharset: process.env.DB_CHARSET ?? 'utf8mb4',
  jwtSecret: process.env.JWT_SECRET ?? 'please_change_to_a_strong_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  deepseekApiKey: process.env.DEEPSEEK_API_KEY ?? 'your_deepseek_api_key',
  deepseekBaseUrl: process.env.DEEPSEEK_BASE_URL ?? 'https://api.deepseek.com',
  deepseekModel: process.env.DEEPSEEK_MODEL ?? 'deepseek-chat',
  deepseekTimeoutMs: toNumber(process.env.DEEPSEEK_TIMEOUT_MS, 30000),
  workspaceDir: process.env.WORKSPACE_DIR ?? './workspaces/ml_gintoki'
} as const;

import { env } from './env';

export const aiConfig = {
  baseUrl: env.deepseekBaseUrl,
  apiKey: env.deepseekApiKey,
  model: env.deepseekModel,
  timeout: env.deepseekTimeout
} as const;

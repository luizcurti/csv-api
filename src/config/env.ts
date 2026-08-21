import 'dotenv/config';
import path from 'path';
import * as Yup from 'yup';

const envSchema = Yup.object({
  NODE_ENV: Yup.string()
    .oneOf(['development', 'production', 'test'])
    .default('development'),
  PORT: Yup.number().integer().positive().default(3005),
  CSV_FILE_PATH: Yup.string().default(
    path.resolve(__dirname, '../../csv/data.csv')
  ),
  CORS_ORIGIN: Yup.string().default('*'),
  RATE_LIMIT_WINDOW_MS: Yup.number().integer().positive().default(60_000),
  RATE_LIMIT_MAX: Yup.number().integer().positive().default(100),
});

const parsed = envSchema.validateSync(process.env, { stripUnknown: true });

export const env = {
  nodeEnv: parsed.NODE_ENV,
  isProduction: parsed.NODE_ENV === 'production',
  port: parsed.PORT,
  csvFilePath: parsed.CSV_FILE_PATH,
  corsOrigin: parsed.CORS_ORIGIN,
  rateLimit: {
    windowMs: parsed.RATE_LIMIT_WINDOW_MS,
    max: parsed.RATE_LIMIT_MAX,
  },
};

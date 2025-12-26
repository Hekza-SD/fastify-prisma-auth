import z from 'zod';

export const ConfigSchema = z.object({
    NODE_ENV: z.enum(['dev', 'prod', 'rec']).default('dev'),
    APP_NAME: z.string().default('MyApp'),
    APP_URL: z.url().default('http://localhost:3000'),

    PORT: z.coerce.number().default(3000),

    DATABASE_URL: z.url(),

    BETTER_AUTH_SECRET: z.string().min(32),
    JWT_SECRET: z.string().min(32),

    LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),

    LOG_DIRECTORY: z.string().default('../logs'),
    SLOW_LOG_THRESHOLD_MS: z.coerce.number().default(300),
});

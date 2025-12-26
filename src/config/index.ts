import { z } from 'zod';
import dotenv from 'dotenv';

import { ConfigSchema } from './config-schema';

dotenv.config();

const parsed = ConfigSchema.safeParse(process.env);

if (!parsed.success) {
    console.error(
        '❌ Invalid configuration:',
        z.treeifyError(parsed.error).errors,
        z.treeifyError(parsed.error).properties
    );
    process.exit(1);
}

export const config = {
    ...parsed.data,
    isProduction: parsed.data.NODE_ENV === 'prod',
    isDevelopment: parsed.data.NODE_ENV === 'dev',
    isRecette: parsed.data.NODE_ENV === 'rec',
};

export type Config = typeof config;

import path from 'path';
import { asyncLocalStorage } from '../utils/context';
import fs from 'fs';
import { config } from '.';

const logDir = path.resolve(__dirname, '../logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

export const slowLoggerOptions = {
    level: 'info',
    mixin() {
        const store = asyncLocalStorage.getStore();
        return store ? { correlationId: store.correlationId } : {};
    },
    destination: !config.isDevelopment ? path.join(logDir, 'slow.log') : undefined,
};

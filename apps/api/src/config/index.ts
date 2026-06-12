import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const staticWebPath =
  process.env.WEB_DIST_PATH ??
  path.join(__dirname, '../../../web/dist');

export const config = {
  port: parseInt(process.env.PORT ?? '3001', 10),
  jwtSecret: process.env.JWT_SECRET ?? 'dev-secret-change-in-production',
  databasePath:
    process.env.DATABASE_PATH ??
    path.join(__dirname, '../../data/sdui.db'),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  staticWebPath,
  serveStatic:
    process.env.SERVE_STATIC === 'true' && fs.existsSync(staticWebPath),
};

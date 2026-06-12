import { createApp } from './app.js';
import { config } from './config/index.js';
import { getDatabase } from './db/database.js';

const app = createApp();

getDatabase();

app.listen(config.port, () => {
  console.log(`API server running on http://localhost:${config.port}`);
  console.log(`Health check: http://localhost:${config.port}/api/v1/health`);
});

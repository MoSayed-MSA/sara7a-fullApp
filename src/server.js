import http from 'http';
import { createApp } from './app.js';
import mongoose from 'mongoose';
import { logger } from './pkg/logger/logger.js';
import { env } from './lib/config/env.js';

const app = createApp();
const server = http.createServer(app);
server.listen(env.port, () => logger.info(`Server started on port ${env.port}`));

async function serverShutdown() {
    await mongoose.connection.close();
    process.exit(0);
}

process.on('SIGINT', serverShutdown);
process.on('SIGTERM', serverShutdown);
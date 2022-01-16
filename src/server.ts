import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { createTerminus } from '@godaddy/terminus';
import morgan from 'morgan';
import axios from 'axios';

import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const env = process.env.NODE_ENV || 'development';
const logDir = 'log';

const dailyRotateFileTransport = new DailyRotateFile({
  level: 'debug',
  filename: `${logDir}/%DATE%-server.log`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

export const logger = createLogger({
  exitOnError: false,
  level: env === 'development' ? 'debug' : 'info',
  format: format.combine(
    format.timestamp({
      format: 'DD/MMM/YYYY:HH:mm:ss ZD',
    }),
    format((info) => {
      info.level = info.level.toUpperCase();
      return info;
    })(),
    format.json(),
  ),
  exceptionHandlers: [
    new transports.File({ filename: `${logDir}/exceptions.log` }),
  ],
  transports: [
    new transports.Console({
      level: 'http',
      format: format.combine(
        format.colorize(),
        format.printf(
          (info) => `[${info.timestamp}] [${info.level}] ${info.message}`,
        ),
      ),
      silent: false,
    }),
    dailyRotateFileTransport,
  ],
});

logger.on('error', (err) => {});

function bootstrap() {
  const app = express();
  const port = process.env.PORT ? process.env.PORT : 8000;
  const apiServerUrl = process.env.API_SERVER
    ? process.env.API_SERVER
    : 'http://localhost:4000';

  const options = {
    target: apiServerUrl,
    pathRewrite: function (path: any, req: any) {
      return path.replace('/api', '');
    },
  };

  app.use(
    morgan(
      `":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"`,
      {
        stream: {
          write: (message: string) => {
            logger.http(message);
          },
        },
      },
    ),
  );

  app.use(express.static('public/'));
  app.use('/api', createProxyMiddleware(options));
  //app.get('/', (req, res) => {
  //  res.sendFile(`../public/index.html`);
  //});

  const onHealthCheck = async () => {
    // return axios.get(`${apiServerUrl}/health`).then(res=> return res);
  };

  const onSignal = async () => {
    logger.info('Server is starting cleanup');
    server.close();
  };

  const server = app.listen(port);

  createTerminus(server, {
    signal: 'SIGINT',
    healthChecks: {
      '/health': onHealthCheck,
    },
    onSignal,
  });

  logger.info(`Server is running at ${port}`);
}
bootstrap();

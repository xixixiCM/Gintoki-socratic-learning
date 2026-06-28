import mysql from 'mysql2/promise';

import { env } from '../config/env';

export const pool = mysql.createPool({
  host: env.dbHost,
  port: env.dbPort,
  user: env.dbUser,
  password: env.dbPassword,
  database: env.dbName,
  waitForConnections: true,
  connectionLimit: env.dbConnectionLimit,
  charset: env.dbCharset
});

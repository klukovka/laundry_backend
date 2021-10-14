import env from 'dotenv';
import { Application } from 'express';
import { DatabaseMongo } from './src/data/dataSource/mongoDB/databaseMongo';
import App from './src/features/app';
import https from 'https';
import http from 'http';

env.config();

const PORT = process.env.PORT;
const HOST: string = process.env.HOST as string;

http
  .createServer(App)
  .listen(Number(PORT), HOST, () => {
    console.log('Server is listening...');
  })
  .once('close', () => DatabaseMongo.getDB.close());

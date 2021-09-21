import env from 'dotenv';
import { Application } from 'express';
import { DatabaseMongo } from './src/data/dataSource/mongoDB/databaseMongo';
import App from './src/features/app';

env.config();

const PORT = process.env.PORT;

const server = (app: Application) => {
  DatabaseMongo.getDB;
  app
    .listen(PORT, () => {
      console.log('Server is listening...');
    })
    .once('close', () => DatabaseMongo.getDB.close());
};

server(App);

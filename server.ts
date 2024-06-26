import env from 'dotenv';
import { Application } from 'express';
import { DatabaseMongo } from './src/data/dataSource/mongoDB/databaseMongo';
import App from './src/controllers/app';
import https from 'https';
import http from 'http';
import fs from 'fs';
import admin from 'firebase-admin';

var serviceAccount = require('./clean-digital-firebase-adminsdk-x8arz-7f32fea765.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();

env.config();

const PORT = process.env.PORT;
const HOST: string = process.env.HOST as string;

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
};

http
  .createServer(App)
  .listen(Number(PORT), HOST, () => {
    console.log(`Server is listening on ${HOST}:${PORT}...`);
  })
  .once('close', () => DatabaseMongo.getDB.close());

export default firestore;

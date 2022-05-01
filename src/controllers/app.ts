import morgan from 'morgan';
import { urlencoded, json } from 'body-parser';
import express, { Application, Request, Response } from 'express';
import StatusCodes from './utils/statusCodes';
import dataFlowRoutes from './routes/dataFlowRoutes';
import authRoutes from './routes/authRoutes';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const options: cors.CorsOptions = {
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'X-Access-Token',
  ],
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  origin: '*',
  preflightContinue: true,
};

const app: Application = express();
app.use(cors(options));

app.use((req: Request, res: Response, next: any) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.setHeader(
      'Access-Control-Allow-Methods',
      'PUT, POST, PATCH, DELETE, GET'
    );
    return res.status(200).json({});
  }
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  next();
});

app.use(morgan('dev'));
app.use(urlencoded({ extended: false }));
app.use(json());
app.use(cookieParser());

app.use('/dataFlow', dataFlowRoutes);
app.use('/auth', authRoutes);

//endpoint doesn't exist
app.use((req: Request, res: Response, next: any) => {
  const error = { message: 'URL is not found', status: StatusCodes.NOT_FOUND };
  next(error);
});

//show error messages
app.use((error: any, req: Request, res: Response, next: any) => {
  res.status(error.status || StatusCodes.INTERNAL_ERROR);
  res.json({
    message: error.message,
  });
});

export default app;

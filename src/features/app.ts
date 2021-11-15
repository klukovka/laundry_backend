import morgan from 'morgan';
import { urlencoded, json } from 'body-parser';
import express, { Application, Request, Response } from 'express';
import StatusCodes from './utils/statusCodes';
import laundryRoutes from './routes/laundries';
import additionalModeRoutes from './routes/additionalModes';
import modeRoutes from './routes/modes';
import washMachineRoutes from './routes/washMachines';
import userRoutes from './routes/users';
import clientRoutes from './routes/clients';
import employeeRoutes from './routes/employees';
import eventRoutes from './routes/events';
import dataFlowRoutes from './routes/dataFlow';
import economyRoutes from './routes/economy';
//import cors from 'cors';

/*const options: cors.CorsOptions = {
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
  preflightContinue: false,
};
*/
const app: Application = express();
//app.use(cors(options));
app.use(morgan('dev'));
app.use(urlencoded({ extended: false }));
app.use(json());

app.use((req: Request, res: Response, next: any) => {
  res.setDefaultEncoding('utf8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'PUT, POST, PATCH, DELETE, GET'
  );

  next();
});

app.use('/laundries', laundryRoutes);
app.use('/additionalModes', additionalModeRoutes);
app.use('/modes', modeRoutes);
app.use('/washMachines', washMachineRoutes);
app.use('/users', userRoutes);
app.use('/clients', clientRoutes);
app.use('/employees', employeeRoutes);
app.use('/events', eventRoutes);
app.use('/dataFlow', dataFlowRoutes);
app.use('/economy', economyRoutes);

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

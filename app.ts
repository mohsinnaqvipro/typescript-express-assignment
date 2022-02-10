import cors from 'cors';
import apiRoutes from './routes/api.routes';
import bodyParser from 'body-parser';
import express, {
  Application,
  Request,
  Response,
  NextFunction,
  request,
  response,
} from 'express';

class App {
  public app: Application;
  public serviceName: string = 'api';

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    //this.initializeRussiaTeamSwagger();
    this.initializeHealthCheck();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    this.app.use(cors({ credentials: true, origin: true }));
    this.app.use(bodyParser.json({ limit: '5mb' }));
    this.app.use(bodyParser.json());
  }

  private initializeRoutes() {

    this.app.use(`/`, apiRoutes);
  }

  private initializeHealthCheck() {
    this.app.use('/health', (request: Request, response: Response) => {
      response.json({ status: 'Service is up and running' });
    });
  }

  private initializeErrorHandling() {
    // Error handling middleware
    this.app.use(
      (
        error: Error,
        request: Request,
        response: Response,
        next: NextFunction
      ) => {
        response.status(500).send({ error: error });
      }
    );

    // catch 404 and forward to error handler
    this.app.use((request: Request, response: Response, next: NextFunction) => {
      const requestURL = request.url;
      const swaggerURL1 = '/api-docs';
      const swaggerURL2 = '/api-docs/';
      if (swaggerURL1 == requestURL || swaggerURL2 == requestURL) {
        response.status(401).send('Authentication failed');
      } else {
        response.status(404).send({ error: 'invalid call!' });
      }
    });
  }
}

export default App;

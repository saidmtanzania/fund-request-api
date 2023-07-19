import { Express, Request, Response } from 'express';
import swaggerJSDoc, { Options } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { version } from '../../package.json';

const options: Options = {
  definition: {
    openApi: '3.0.0',
    info: {
      title: 'Restful API',
      description:
        'RESTful API for managing financial requests from employees within a company or organization. The API has three types of users: admin, finance manager, and staff.',
      version,
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
      },
    ],
    components: {
      securitySchemas: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app: Express) {
  // Swagger page
  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  // Docs in JSON format
  app.get('/api/v1/docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}

export default swaggerDocs;

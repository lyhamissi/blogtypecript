import swaggerJSDoc from  'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title : 'Blog Api',
            version: '1.0.0',
            description: 'Blog Api documentation using swagger',
        },
        servers: [
            {
                url: 'http://127.0.0.1:4000',
            },
        ],
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app:Express)=> {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
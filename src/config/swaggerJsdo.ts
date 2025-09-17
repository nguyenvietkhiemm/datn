import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
    },
  },
  apis: ['./src/server.ts', './src/routes/*.ts'], // Đường dẫn file chứa swagger comment
};

const specs = swaggerJsdoc(options);

export default specs;

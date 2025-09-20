require('dotenv').config();

import express from 'express';

import routes from './routes/index';

import swaggerUi from 'swagger-ui-express';
import specs from './config/swagger.jsdoc';
import morgan from 'morgan';

const app = express();
app.use(morgan('dev'));
app.use(express.json());

// route cho api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// routes chung cho tat ca cac api
app.use('/', routes);

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";

app.listen(PORT, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
  console.log(`Swagger docs at http://${HOST}:${PORT}/api-docs`);
});

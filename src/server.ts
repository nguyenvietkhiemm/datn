require('dotenv').config();

import express from 'express';
import cors from "cors";
import path from "path";

import routes from './routes/index';

import swaggerUi from 'swagger-ui-express';
import {specs, swaggerOptions} from './config/swagger.jsdoc';
import morgan from 'morgan';

const app = express();

//cho xem tai lieu
app.use("/resources", express.static(path.join(__dirname, "../resources")));

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
// route cho api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));

// routes chung cho tat ca cac api
app.use('/', routes);

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";

app.listen(PORT, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
  console.log(`Swagger docs at http://${HOST}:${PORT}/api-docs`);
});

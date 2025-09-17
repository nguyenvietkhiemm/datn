import express from 'express';
import roleRoute from './routes/roleRoute';

import swaggerUi from 'swagger-ui-express';
import specs from './config/swaggerJsdo';

const app = express();
app.use(express.json());

app.use('/roles', roleRoute);;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
});

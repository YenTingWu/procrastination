import 'reflect-metadata';
import express from 'express';
import { createConnection } from 'typeorm';
import { morganMiddleware } from './middleware/morganMiddleware';

(async () => {
  const PORT = process.env.PORT || 5000;
  const app = express();

  app.use(morganMiddleware);

  await createConnection();

  app.get('/', (_req, res) => {
    res.send('Hello this is an app');
  });

  app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
  });
})();

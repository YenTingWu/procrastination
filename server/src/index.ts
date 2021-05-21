import 'reflect-metadata';
import express from 'express';
import { createConnection } from 'typeorm';
import { morganMiddleware } from './middleware/morganMiddleware';
import authRouter from './routes/auth';

(async () => {
  const PORT = process.env.PORT || 5000;
  const app = express();

  app.use(morganMiddleware);

  await createConnection();

  app.get('/', (_req, res) => {
    res.send('Hello this is an app');
  });

  app.use('/auth', authRouter);

  app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
  });
})();

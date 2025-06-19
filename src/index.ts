import dotenv from 'dotenv';
import app from './app';
import { AppDataSource } from './config/database';

dotenv.config();
const PORT = Number(process.env.PORT) || 5000;

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on ${PORT}`);
    });

  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });

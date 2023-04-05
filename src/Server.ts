import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './App';

dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION! 👋 Shutting down..');
  process.exit(1);
});

let DB;
if (process.env.NODE_ENV === 'development') {
  DB = process.env.LOCAL_DB;
} else if (process.env.NODE_ENV === 'production') {
  DB = process.env.DATABASE;
}
if (!DB) {
  throw new Error('refuse to connect');
}

mongoose.connect(DB).then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err: Error) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! 👋 Shutting down..');
  // Graceful Shutdown
  server.close(() => {
    process.exit(1);
  });
});

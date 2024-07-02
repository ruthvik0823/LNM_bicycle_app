import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import userRouter from './routes/userroutes.js';
import cycleRouter from './routes/cycleroutes.js';
import bookingRouter from './routes/bookingroutes.js';
import { AdminverifyJwt } from './Middleware/AdminauthMiddleware.js';
import { verifyJwt } from './Middleware/auth.middleware.js';

const app = express();

// Middleware setup
app.use(cors({
  origin: 'https://lnmbicycle.netlify.app',
  credentials : true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/user', userRouter);
app.use('/cycle',cycleRouter);
app.use('/booking', bookingRouter);

app.get('/', (req, res) => {
  res.send('Sriman');
});

// Server start
app.listen(8000, () => {
  console.log("Server is running at port 8000");
});

export default app;

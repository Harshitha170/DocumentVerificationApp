// src/app.js
import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.routes.js';
import adminRouter from './routes/admin.routes.js';
import documentRouter from './routes/document.routes.js';
import userRouter from './routes/user.routes.js';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/documents', documentRouter); // frontend API calls
app.use('/api/users', userRouter);
export { app };
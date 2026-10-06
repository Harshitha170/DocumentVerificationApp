import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.routes.js';
import adminRouter from './routes/admin.routes.js';

const app = express();

app.use(express.json());
app.use(cors());


app.use('/api/auth', authRouter);
app.use('/api/v1/admin', adminRouter);

export {app};
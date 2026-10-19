import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRouter from './routes/auth.routes.js';
import adminRouter from './routes/admin.routes.js';
import documentRouter from './routes/document.routes.js';
import userRouter from './routes/user.routes.js';
import assetRoutes from './routes/asset.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cors());

// Serve the 'uploads' folder publicly
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/documents', documentRouter); 
app.use('/api/users', userRouter);
app.use('/api/assets', assetRoutes);

export { app };
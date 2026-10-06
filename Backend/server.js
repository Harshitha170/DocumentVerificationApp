import 'dotenv/config';

import express from 'express';

import cors from 'cors';
import {app} from './app.js'
import connectDb from './config/db.js';



connectDb()
.then(() => {
    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server is running at port: ${process.env.PORT}`);
        
    })
})
.catch((err) => {
    console.log("MONGODB Connection failed", err);
})
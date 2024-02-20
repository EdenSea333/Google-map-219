import express from 'express' ;
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import fileRouter from './routes/file.route.js';
import companyRouter from './routes/company.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
dotenv.config();

mongoose
    .connect(process.env.MONGO)
    .then(() => {
        console.log('Conneceted to MongoDB!');
    })
    .catch((err) => {
        console.log(err);
    });

    const __dirname = path.resolve();

const app = express();

app.use(express.json());

app.use(cookieParser());

// app.listen(3000, () => {
//     console.log('server is running on port 3000!');
// });

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/file', fileRouter);
app.use('/api/company', companyRouter);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    console.error('Error', message);
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});
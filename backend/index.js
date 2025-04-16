import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './components/db.js';
import userRoutes from './routes/user.route.js';
import postRoutes from './routes/post.route.js';
import messageRoutes from './routes/message.route.js';
import path from "path";


dotenv.config();
const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
    origin: ['https://notinsta-gr7b.onrender.com','https://notinsta.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}
app.use(cors(corsOptions));

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/post', postRoutes);
app.use('/api/v1/message', messageRoutes);

app.listen(PORT,()=>{
    connectDB();
    console.log(`Server at port ${PORT}`)
});

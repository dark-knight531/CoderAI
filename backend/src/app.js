import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Import Routes
import aiRoutes from '../routes/ai.routes.js';
import userRoutes from '../routes/user.routes.js'; 

const app = express();


app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173', 
    credentials: true 
}));


app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser()); 


app.get('/', (req, res) => {
    res.send("AI Code Reviewer API is running smoothly");
});


app.use('/api/v1/users', userRoutes);
app.use('/api/v1/ai', aiRoutes);

export { app };
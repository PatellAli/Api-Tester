import express, { json } from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import router from './routes/api.route.js';
import cors from 'cors';

dotenv.config();
const PORT = process.env.PORT;

const app = express(); // ✅ fixed typo

app.use(cors());
app.use(express.json()); // ✅ fixed typo

app.use('/history', router);

app.listen(PORT, () => {
    connectDB();
    console.log("Server started at port:", PORT);
});

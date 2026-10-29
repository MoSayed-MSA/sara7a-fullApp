import mongoose from 'mongoose';
import { env } from '../config/env.js';

function connectDB() {
    mongoose.connect(env.databaseUrl).then(() => {
        console.log('MongoDB connected');
    }).catch((err) => {
        console.log(err);
    });

}

export default connectDB;
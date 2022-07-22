import { dbConfig } from '../db.config.js';
import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
export const db = {
    mongoose,
    url: dbConfig.url
};

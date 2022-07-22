import {dbConfig} from '../db.config.js';
import mongoose from 'mongoose';


mongoose.Promise = global.Promise;
export const db: { [klass: string]: any } = {
    mongoose,
    url: dbConfig.url
};
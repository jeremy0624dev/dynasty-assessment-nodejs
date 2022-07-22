import mongoose from 'mongoose';

export interface iStream {
    _id?: mongoose.Types.ObjectId,
    name: string,
}

const streamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    deletedAt: {
        type: Date,
        required: false,
    },
}, {
    timestamps: true,
});

export default mongoose.model<iStream>('Stream', streamSchema);
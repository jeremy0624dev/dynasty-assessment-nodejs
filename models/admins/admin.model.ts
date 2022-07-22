import mongoose from 'mongoose';

export interface iAdmin {
    _id?: mongoose.Types.ObjectId,
    username: string,
}

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    deletedAt: {
        type: Date,
        required: false,
    },
}, {
    timestamps: true,
});

export default mongoose.model<iAdmin>('Admin', adminSchema);
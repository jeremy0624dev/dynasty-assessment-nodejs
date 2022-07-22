import mongoose from 'mongoose';

export interface iLogin {
    _id?: mongoose.Types.ObjectId,
    expiredAt: Date,
    apiKey: string,
    adminId: mongoose.Types.ObjectId,
}

const loginSchema = new mongoose.Schema({
    apiKey: {
        type: String,
        required: true,
        unique: true,
    },
    adminId: {
        type: mongoose.Types.ObjectId,
        ref: 'Admin',
        required: true,
    },
    expiredAt: {
        type: Date,
        required: false,
    },
}, {
    timestamps: true,
});

export default mongoose.model<iLogin>('Login', loginSchema);
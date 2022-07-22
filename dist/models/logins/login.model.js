import mongoose from 'mongoose';
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
export default mongoose.model('Login', loginSchema);

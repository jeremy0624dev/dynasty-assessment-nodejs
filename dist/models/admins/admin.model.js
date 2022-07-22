import mongoose from 'mongoose';
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
export default mongoose.model('Admin', adminSchema);

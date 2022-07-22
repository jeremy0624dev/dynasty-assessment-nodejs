import mongoose from 'mongoose';
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
export default mongoose.model('Stream', streamSchema);

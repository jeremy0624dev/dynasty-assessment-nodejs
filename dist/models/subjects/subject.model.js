import mongoose from 'mongoose';
const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    streamId: {
        type: mongoose.Types.ObjectId,
        ref: 'Stream',
        required: true,
    },
    deletedAt: {
        type: Date,
        required: false,
    },
    modifiedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'Admin',
        required: false,
    },
}, {
    timestamps: true,
    toJSON: {
        // So `res.json()` and other `JSON.stringify()` functions include virtuals
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    }
});
subjectSchema.virtual('stream', {
    ref: 'Stream',
    localField: 'streamId',
    foreignField: '_id',
    justOne: true,
});
export default mongoose.model('Subject', subjectSchema);

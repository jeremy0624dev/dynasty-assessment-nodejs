import mongoose from 'mongoose';
const trainingSubjectSchema = new mongoose.Schema({
    trainingId: {
        type: mongoose.Types.ObjectId,
        ref: 'Training',
        required: true,
    },
    subjectId: {
        type: mongoose.Types.ObjectId,
        ref: 'Subject',
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
});
export default mongoose.model('TrainingSubject', trainingSubjectSchema);

import mongoose from 'mongoose';

export interface iTrainingSubject {
    _id?: mongoose.Types.ObjectId,
    trainingId: mongoose.Types.ObjectId | string,
    subjectId: mongoose.Types.ObjectId | string,
}

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
        required: false
        ,
    },
}, {
    timestamps: true,
});

export default mongoose.model<iTrainingSubject>('TrainingSubject', trainingSubjectSchema);
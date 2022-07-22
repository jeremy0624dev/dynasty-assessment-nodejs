import mongoose from 'mongoose';

export interface iTraining {
    _id?: mongoose.Types.ObjectId,
    modifiedBy?: mongoose.Types.ObjectId,
    name: string,
    type: string,
    subjectNames?: string[],
    modifiedByUsername?: string,
}

export enum TrainingType {
    Basic = 'Basic',
    Detailied = 'Detailed',
}

const trainingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
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

export default mongoose.model<iTraining>('Training', trainingSchema);
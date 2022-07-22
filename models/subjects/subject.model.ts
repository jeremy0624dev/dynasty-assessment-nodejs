import mongoose from 'mongoose';

export interface iSubject {
    _id?: mongoose.Types.ObjectId | string,
    name: string,
    streamId: mongoose.Types.ObjectId | string,
    modifiedBy?: mongoose.Types.ObjectId | string,
}

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
        required: false
        ,
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

})


export default mongoose.model<iSubject>('Subject', subjectSchema);
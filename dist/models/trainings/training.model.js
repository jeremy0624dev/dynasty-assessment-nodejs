import mongoose from 'mongoose';
export var TrainingType;
(function (TrainingType) {
    TrainingType["Basic"] = "Basic";
    TrainingType["Detailied"] = "Detailed";
})(TrainingType || (TrainingType = {}));
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
        required: false,
    },
}, {
    timestamps: true,
});
export default mongoose.model('Training', trainingSchema);

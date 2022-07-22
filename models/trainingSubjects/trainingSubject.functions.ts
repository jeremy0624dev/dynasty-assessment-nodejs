import TrainingSubject from '../trainingSubjects/trainingSubject.model.js';

export async function findTrainingIdsViaSubjectIds(subjectIds: string[]) {
    const docs = await TrainingSubject.find({
        subjectId: { $in: subjectIds },
        deletedAt: null,
    }, { trainingId: 1 });
    return docs.map(x => x.trainingId.toString());
}

export async function getTrainingsSubjects(trainingIds: string[]) {
    return TrainingSubject.find({
        trainingId: { $in: trainingIds },
        deletedAt: null,
    }, { trainingId: 1, subjectId: 1 });
}
import Training, { TrainingType } from "../models/trainings/training.model.js";
import Subject from "../models/subjects/subject.model.js";
import { capitaliseFirstCharEachWord } from "../helper.js";
import TrainingSubject from "../models/trainingSubjects/trainingSubject.model.js";
import { findSubjectId, findSubjectIdsViaStreamId, getSubjects } from "../models/subjects/subject.functions.js";
import { findStreamId } from "../models/streams/stream.functions.js";
import { findTrainingIdsViaSubjectIds, getTrainingsSubjects } from "../models/trainingSubjects/trainingSubject.functions.js";
import { getAdmins } from "../models/admins/admin.functions.js";
export async function getTrainings(filters) {
    const { subject, stream, type } = filters || {};
    let subjectId = '';
    let subjectIds = [];
    let trainingIds = [];
    if (subject) {
        subjectId = (await findSubjectId(subject)).toString();
        // if there is no matched subject, return empty result
        if (!subjectId)
            return [];
    }
    if (stream) {
        const streamId = (await findStreamId(stream))?.toString();
        if (streamId) {
            subjectIds = await findSubjectIdsViaStreamId(streamId);
            // if there are no matched subjects of the steam, return empty result
            if (!subjectIds.length)
                return [];
        }
        else
            return [];
    }
    if (subjectId)
        subjectIds = [subjectId];
    if (subjectIds.length) {
        trainingIds = await findTrainingIdsViaSubjectIds(subjectIds);
        if (!trainingIds.length)
            return [];
    }
    const trainingDocs = await Training.find({
        ...(trainingIds.length ? { _id: { $in: trainingIds } } : {}),
        ...(type ? { type: capitaliseFirstCharEachWord(type) } : {}),
        deletedAt: null,
    }).lean();
    return processTrainings(trainingDocs);
}
async function processTrainings(trainings) {
    const trainingIds = [];
    const adminIdSet = new Set();
    for (const t of trainings) {
        trainingIds.push(String(t._id || ''));
        adminIdSet.add(String(t.modifiedBy || ''));
    }
    const adminIds = [...adminIdSet];
    if (!trainingIds.length)
        return trainings;
    // get all records of training's subjects
    const trainingSubjects = await getTrainingsSubjects(trainingIds);
    const trainingIdToSubjectIdsMap = trainingSubjects.reduce((_res, doc) => {
        const result = _res;
        const trainingId = String(doc.trainingId);
        const subjectId = String(doc.subjectId);
        if (!result[trainingId])
            result[trainingId] = [];
        result[trainingId].push(subjectId);
        return result;
    }, {});
    // get all matched subjects
    const subjectIds = trainingSubjects.map(x => String(x.subjectId));
    const subjectDocs = await getSubjects({ ids: subjectIds });
    const subjectMap = subjectDocs.reduce((_res, sub) => {
        const result = _res;
        result[String(sub._id)] = sub;
        return result;
    }, {});
    // get all matched admins
    const adminDocs = await getAdmins({ ids: adminIds });
    const adminMap = adminDocs.reduce((_res, admin) => {
        const result = _res;
        result[String(admin._id)] = admin;
        return result;
    }, {});
    // assign subjectNames and modifiedByUsername
    for (const training of trainings) {
        const trainingId = String(training._id);
        training.subjectNames = [];
        if (trainingIdToSubjectIdsMap[trainingId]?.length) {
            training.subjectNames = trainingIdToSubjectIdsMap[trainingId].map(x => (subjectMap[x])?.name || '');
        }
        training.modifiedByUsername = adminMap[String(training.modifiedBy)]?.username || '';
    }
    return trainings;
}
export async function addNewTraining(name = '', subjects = [], type, adminId) {
    if (!name)
        throw new Error('Name is required.');
    if (!subjects.length)
        throw new Error('At least one subject is required.');
    if (!type)
        throw new Error('Type is required.');
    let subjectIds = [];
    // convert first letter of each word to be capital
    const processedName = capitaliseFirstCharEachWord(name);
    // make sure training name is unique
    const count = await Training.countDocuments({
        name: processedName,
        deletedAt: null,
    });
    if (count)
        throw new Error('This training exists in the system. Please try with another title.');
    // validate subjects
    const uniqueSubjects = [...new Set(subjects.map(x => capitaliseFirstCharEachWord(x)))];
    const validSubjectDocs = await Subject.find({
        name: { $in: uniqueSubjects },
        deletedAt: null,
    });
    // return invalid subjects to frontend
    if (uniqueSubjects.length > validSubjectDocs.length) {
        const invalidSubjects = uniqueSubjects.reduce((_result, name) => {
            const result = _result;
            const matchedDoc = validSubjectDocs.find(x => x.name === name);
            if (!matchedDoc)
                result.push(name);
            return result;
        }, []);
        if (invalidSubjects.length)
            throw new Error(`Invalid Subject(s): ${invalidSubjects.join(', ')}`);
    }
    else {
        subjectIds = validSubjectDocs.map(x => String(x._id));
    }
    // validate type
    const processedType = capitaliseFirstCharEachWord(type);
    const matchedType = Object.values(TrainingType).find(x => x === processedType);
    if (!matchedType)
        throw new Error(`Type (${processedType}) is invalid.`);
    const newTraining = await Training.create({
        name: processedName,
        type: processedType,
        modifiedBy: adminId,
    });
    // save training's subjects
    if (subjectIds.length) {
        await TrainingSubject.insertMany(subjectIds.map(subjectId => ({
            trainingId: newTraining._id,
            subjectId,
            modifiedBy: adminId,
        })));
    }
    return newTraining;
}

import { TrainingType } from "../models/trainings/training.model.js";
import Admin from '../models/admins/admin.model.js';
import Login from '../models/logins/login.model.js';
import Stream from '../models/streams/stream.model.js';
import Subject from '../models/subjects/subject.model.js';
import Training from '../models/trainings/training.model.js';
import TrainingSubject from '../models/trainingSubjects/trainingSubject.model.js';
const streams = [
    'Science',
    'Arts',
    'Commerce',
];
const subjects = [
    {
        name: 'Maths',
        stream: 'Science',
    }, {
        name: 'English',
        stream: 'Arts',
    }, {
        name: 'Physics',
        stream: 'Science',
    }, {
        name: 'Economics',
        stream: 'Commerce',
    }, {
        name: 'Social Science',
        stream: 'Arts',
    }, {
        name: 'Finance',
        stream: 'Commerce',
    }
];
const trainings = [
    {
        name: 'Basics of Eng',
        subjects: [
            'Maths',
            'Physics',
            'English',
        ],
        type: TrainingType.Basic,
    }, {
        name: 'CA Fundamentals',
        subjects: [
            'English',
            'Economics',
            'Finance',
        ],
        type: TrainingType.Basic,
    }, {
        name: 'International arts',
        subjects: [
            'English',
            'Social Science',
            'Finance',
        ],
        type: TrainingType.Detailied,
    },
];
const admins = ['Superadmin', 'Admin001', 'Admin002'];
export async function setCollectionsToDefault() {
    let toCreateAllRecords = false;
    let allStreams = [];
    let allSubjects = [];
    let allTrainings = [];
    const streamNameToIdMap = {};
    const subjectNameToIdMap = {};
    // delete all
    console.log('Deleting all documents.');
    await Subject.deleteMany({});
    await Training.deleteMany({});
    await TrainingSubject.deleteMany({});
    await Login.deleteMany({});
    await Admin.deleteMany({});
    await Stream.deleteMany({});
    // create sample data for the first time
    console.log('Creating default documents.');
    // create default admins
    const adminDocs = admins.map(admin => ({
        username: admin,
    }));
    const allAdmins = await Admin.insertMany(adminDocs);
    const superAdmin = allAdmins[0];
    // create default streams
    const streamDocs = streams.map(stream => ({
        name: stream,
    }));
    allStreams = await Stream.insertMany(streamDocs);
    for (const streamDoc of allStreams) {
        streamNameToIdMap[streamDoc.name] = streamDoc._id?.toString() || '';
    }
    // create default subjects
    const subjectDocs = subjects.map(subject => ({
        name: subject.name,
        streamId: streamNameToIdMap[subject.stream],
        modifiedBy: superAdmin._id,
    }));
    allSubjects = await Subject.insertMany(subjectDocs);
    for (const subjectDoc of allSubjects) {
        subjectNameToIdMap[subjectDoc.name] = subjectDoc._id?.toString() || '';
    }
    // create default trainings
    const trainingDocs = trainings.map(training => ({
        name: training.name,
        type: training.type,
        modifiedBy: superAdmin._id,
    }));
    allTrainings = await Training.insertMany(trainingDocs);
    // create default training-subject records
    const trainingSubjects = [];
    for (const oriTraining of trainings) {
        const createdTraining = allTrainings.find(ct => ct.name === oriTraining.name);
        if (createdTraining) {
            oriTraining.subjects.forEach((subjectName) => {
                if (createdTraining._id) {
                    trainingSubjects.push({
                        trainingId: createdTraining._id,
                        subjectId: subjectNameToIdMap[subjectName],
                    });
                }
            });
        }
    }
    if (trainingSubjects.length)
        await TrainingSubject.insertMany(trainingSubjects);
}

import {iTraining, TrainingType} from "../models/trainings/training.model.js";
import Admin, {iAdmin} from '../models/admins/admin.model.js';
import Login from '../models/logins/login.model.js';
import Stream, {iStream} from '../models/streams/stream.model.js';
import Subject, {iSubject} from '../models/subjects/subject.model.js';
import Training from '../models/trainings/training.model.js';
import TrainingSubject, {iTrainingSubject} from '../models/trainingSubjects/trainingSubject.model.js';

const streams: string[] = [
    'Science',
    'Arts',
    'Commerce',
];

const subjects: { name: string; stream: string }[] = [
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

const trainings: { name: string; subjects: string[]; type: TrainingType }[] = [
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
]

const admins:string[] = ['Superadmin', 'Admin001', 'Admin002'];

/**
 * Reset collections and documents to default
 */
export async function setCollectionsToDefault() {
    let allStreams:iStream[] = [];
    let allSubjects:iSubject[] = [];
    let allTrainings:iTraining[] = [];
    const streamNameToIdMap: { [klass: string]: string } = {};
    const subjectNameToIdMap: { [klass: string]: string } = {};
    // delete all
    console.log('Deleting all documents.')
    await Subject.deleteMany({});
    await Training.deleteMany({});
    await TrainingSubject.deleteMany({});
    await Login.deleteMany({});
    await Admin.deleteMany({});
    await Stream.deleteMany({});
    // create sample data for the first time
    console.log('Creating default documents.')
    // create default admins
    const adminDocs:iAdmin[] = admins.map(admin => ({
        username: admin,
    }));
    const allAdmins = await Admin.insertMany(adminDocs);
    const superAdmin = allAdmins[0];
    // create default streams
    const streamDocs:iStream[] = streams.map(stream => ({
        name: stream,
    }));
    allStreams = await Stream.insertMany(streamDocs);
    for (const streamDoc of allStreams) {
        streamNameToIdMap[streamDoc.name] = streamDoc._id?.toString() || '';
    }
    // create default subjects
    const subjectDocs:iSubject[] = subjects.map(subject => ({
        name: subject.name,
        streamId: streamNameToIdMap[subject.stream],
        modifiedBy: superAdmin._id,
    }));
    allSubjects = await Subject.insertMany(subjectDocs);
    for (const subjectDoc of allSubjects) {
        subjectNameToIdMap[subjectDoc.name] = subjectDoc._id?.toString() || '';
    }
    // create default trainings
    const trainingDocs:iTraining[] = trainings.map(training => ({
        name: training.name,
        type: training.type,
        modifiedBy: superAdmin._id,
    }));
    allTrainings = await Training.insertMany(trainingDocs);
    // create default training-subject records
    const trainingSubjects:iTrainingSubject[] = [];
    for (const oriTraining of trainings) {
        const createdTraining = allTrainings.find(ct => ct.name === oriTraining.name);
        if (createdTraining) {
            oriTraining.subjects.forEach((subjectName) => {
                if (createdTraining._id) {
                    trainingSubjects.push({
                        trainingId: createdTraining._id,
                        subjectId: subjectNameToIdMap[subjectName],
                    })
                }
            });

        }
    }
    if (trainingSubjects.length) await TrainingSubject.insertMany(trainingSubjects);
}
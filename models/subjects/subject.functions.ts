import Subject from '../subjects/subject.model.js';
import {capitaliseFirstCharEachWord} from "../../helper.js";

export async function findSubjectId(name: string) {
    const subjectDoc = await Subject.findOne({
        name: capitaliseFirstCharEachWord(name),
        deletedAt: null,
    }, { _id: 1 });
    return subjectDoc?._id || '';
}

export async function findSubjectIdsViaStreamId(streamId: string) {
    const docs = await Subject.find({
        streamId,
        deletedAt: null,
    }, { _id: 1 });
    return docs.map(x => x._id.toString());
}

export async function getSubjects(filters?: { ids?: string[]; names?: string[] }) {
    const { ids, names } = filters || {};
    return Subject.find({
        ...((Array.isArray(ids) && ids.length) ? { _id: { $in: ids } } : {}),
        ...((Array.isArray(names) && names.length) ? { name: { $in: names.map(x => capitaliseFirstCharEachWord(x)) } } : {}),
        deletedAt: null,
    });
}
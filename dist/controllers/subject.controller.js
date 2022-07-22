import Subject from '../models/subjects/subject.model.js';
import Stream from '../models/streams/stream.model.js';
import { capitaliseFirstCharEachWord } from "../helper.js";
export var SortOrder;
(function (SortOrder) {
    SortOrder["Asc"] = "ASC";
    SortOrder["Dsc"] = "DSC";
})(SortOrder || (SortOrder = {}));
export async function addNewSubject(name, stream, adminId) {
    if (!name)
        throw new Error('Name is required.');
    if (!stream)
        throw new Error('Stream is required.');
    // convert first letter of each word to be capital
    const processedName = capitaliseFirstCharEachWord(name);
    // make sure subject name is unique
    const count = await Subject.countDocuments({
        name: processedName,
        deletedAt: null,
    });
    if (count)
        throw new Error('This subject exists in the system. Please try with another title.');
    //validate stream
    const processedStream = capitaliseFirstCharEachWord(stream);
    const matchedStream = await Stream.findOne({
        name: processedStream,
        deletedAt: null,
    }, '_id');
    if (!matchedStream)
        throw new Error(`The provided stream (${stream}) is invalid.`);
    const newSubject = new Subject({
        name: processedName,
        streamId: matchedStream._id,
        modifiedBy: adminId,
    });
    return newSubject.save();
}
export async function getSubjects(options) {
    const { sortOrder = SortOrder.Asc, pageSize = 10, offset = 0 } = options || {};
    return Subject.find({}, '', {
        sort: {
            name: sortOrder === SortOrder.Asc ? 1 : -1
        },
        skip: offset,
        limit: pageSize,
    }).populate({
        path: 'stream',
        select: '_id name'
    }).lean();
}

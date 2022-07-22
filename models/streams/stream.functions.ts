import Stream from '../streams/stream.model.js';
import {capitaliseFirstCharEachWord} from "../../helper.js";

export async function findStreamId(name: string) {
    const streamDoc = await Stream.findOne({
        name: capitaliseFirstCharEachWord(name),
        deletedAt: null,
    }, { _id: 1 });
    return streamDoc?._id || '';
}
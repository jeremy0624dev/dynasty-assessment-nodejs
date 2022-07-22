import Admin from './admin.model.js';
/**
 * @param {string} username
 * @return {string} apiKey
 */
export async function getAdmins(filters) {
    const { ids, usernames } = filters || {};
    return Admin.find({
        ...((Array.isArray(ids) && ids.length) ? { _id: { $in: ids } } : {}),
        ...((Array.isArray(usernames) && usernames.length) ? { username: { $in: usernames } } : {}),
        deletedDate: null,
    });
}

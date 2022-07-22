import Login from './login.model.js';
export async function logoutExistingSessions(adminId) {
    await Login.updateMany({
        adminId,
        deletedAt: null,
    }, {
        deletedAt: new Date(),
    });
}
export async function createNewSession(adminId, apiKey) {
    return Login.create({
        adminId,
        apiKey,
        expiredAt: (new Date).setDate((new Date).getDate() + 1)
    });
}
export async function extendExpiry(options) {
    if (!options.id && !options.apiKey)
        throw new Error('Backend: invalid params.');
    const newExpiredDate = (new Date).setDate((new Date).getDate() + 1);
    const result = await Login.findOneAndUpdate({
        ...(options.id ? { _id: options.id } : {}),
        ...(options.apiKey ? { apiKey: options.apiKey } : {}),
        expiredAt: { $gt: new Date() },
        deletedAt: null,
    }, {
        expiredAt: newExpiredDate,
    });
    if (!result)
        throw new Error('Your login session has expired. Please login again.');
    return result;
}
export async function getActiveSession(apiKey) {
    return Login.findOne({
        apiKey,
        expiredAt: { $gt: new Date() },
        deletedAt: null,
    });
}

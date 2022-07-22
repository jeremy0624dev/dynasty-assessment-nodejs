import { extendExpiry, getActiveSession } from "../models/logins/login.functions.js";
export default async function validateApiKey(req, res, next) {
    const apiKey = req.body.apiKey || req.query.apiKey || req.headers["x-access-token"] || req.headers["x-api-key"];
    const activeSession = await getActiveSession(apiKey);
    if (!activeSession) {
        return next(new Error('You login session is no longer valid. Please log in again.'));
    }
    extendExpiry({
        id: String(activeSession._id),
    });
    req.body.adminId = activeSession.adminId;
    return next();
}

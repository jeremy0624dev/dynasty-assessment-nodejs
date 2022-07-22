import uuidAPIKey from 'uuid-apikey';
import Admin from '../models/admins/admin.model.js';
import { createNewSession, logoutExistingSessions } from "../models/logins/login.functions.js";
/**
 * @param {string} username
 * @return {string} apiKey
 */
export async function adminLogin(username) {
    const admin = await Admin.findOne({
        username,
        deletedDate: null,
    });
    if (!admin)
        throw new Error('Invalid admin username.');
    const adminId = admin._id.toString();
    // remove all other login sessions
    await logoutExistingSessions(adminId);
    const { apiKey } = uuidAPIKey.create();
    await createNewSession(adminId, apiKey);
    return apiKey;
}

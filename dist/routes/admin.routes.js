import { Router } from 'express';
import { adminLogin } from '../controllers/admin.controller.js';
import { returnError } from "../middleware/error.js";
import { setCollectionsToDefault } from "../controllers/setup.controller.js";
const router = Router();
router.post("/login", async (req, res, next) => {
    try {
        const { username } = req.body;
        const apiKey = await adminLogin(username);
        res.status(200).json({ apiKey });
    }
    catch (e) {
        returnError(res, e);
    }
});
router.post("/setCollectionsToDefault", async (req, res, next) => {
    try {
        await setCollectionsToDefault();
        res.status(204).end();
    }
    catch (e) {
        returnError(res, e);
    }
});
export default router;

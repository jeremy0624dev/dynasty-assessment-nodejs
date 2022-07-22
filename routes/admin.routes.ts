import {NextFunction, Request, Response, Router} from 'express';
import {adminLogin} from '../controllers/admin.controller.js';
import {returnError} from "../middleware/error.js";
import {setCollectionsToDefault} from "../controllers/setup.controller.js";
const router = Router();

router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username } = req.body;
        const apiKey = await adminLogin(username);
        res.status(200).json({ apiKey });
    } catch(e:any) {
        returnError(res, e);
    }
});

router.post("/setCollectionsToDefault", async (req: Request, res: Response, next: NextFunction) => {
    try {
        await setCollectionsToDefault();
        res.status(204).end();
    } catch(e:any) {
        returnError(res, e);
    }
});
export default router;
import {NextFunction, Request, Response, Router} from 'express';
import auth from '../middleware/auth.js';
import {returnError} from "../middleware/error.js";
import {addNewTraining, getTrainings} from "../controllers/training.controller.js";

const router = Router();

router.post('', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { subject, stream, type } = req.body;
        const trainings = await getTrainings({
            subject,
            stream,
            type,
        })
        res.status(200).json({ trainings });
    } catch(e:any) {
        returnError(res, e);
    }
});

router.post("/new", auth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, subjects, type, adminId } = req.body;
        const training = await addNewTraining(name, subjects, type, adminId)
        res.status(200).json({ training });
    } catch(e:any) {
        returnError(res, e);
    }
});
export default router;
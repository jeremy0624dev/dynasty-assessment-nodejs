import {NextFunction, Request, Response, Router} from 'express';
import {returnError} from "../middleware/error.js";
import {addNewSubject, getSubjects, SortOrder} from "../controllers/subject.controller.js";
import auth from '../middleware/auth.js';

const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        let sortOrder = SortOrder.Asc;
        let pageSize = 10;
        let page = 1;
        if (req.query.sortOrder) {
            if (['asc'.toUpperCase(), '1'].includes(req.query.sortOrder.toString().toUpperCase())) {
                sortOrder = SortOrder.Asc;
            } else {
                sortOrder = SortOrder.Dsc;
            }
        }
        // ensure to cater if passed in value is not a number
        if (req.query.pageSize) {
            pageSize = Number(req.query.pageSize)
            pageSize = Number.isNaN(pageSize) ? 10 : pageSize;
        }
        if (req.query.page) {
            page = Number(req.query.page)
            page = Number.isNaN(page) ? 10 : page;
        }
        const subjects = await getSubjects({
            sortOrder,
            pageSize,
            offset: (page - 1) * pageSize,
        })
        res.status(200).json({ subjects });
    } catch(e:any) {
        returnError(res, e);
    }
});

router.post("/new", auth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, stream, adminId } = req.body;
        const subject = await addNewSubject(name, stream, adminId)
        res.status(200).json({ subject });
    } catch(e:any) {
        returnError(res, e);
    }
});

export default router;
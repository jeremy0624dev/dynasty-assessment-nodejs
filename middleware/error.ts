import {Response} from "express";

export function returnError(res: Response, e:any) {
    const errMsg = e?.message || 'Some errors happen.';
    res.status(400).send({
        error: errMsg,
        message: errMsg,
    });
}
export function returnError(res, e) {
    const errMsg = e?.message || 'Some errors happen.';
    res.status(400).send({
        error: errMsg,
        message: errMsg,
    });
}

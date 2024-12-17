import { Request, Response } from "express";

export const emailResending = (req: Request, res: Response) => {
    res.sendStatus(204)
};

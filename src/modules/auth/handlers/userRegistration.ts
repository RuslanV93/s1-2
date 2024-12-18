import { Request, Response } from "express";
import { authService } from "../services/authService";
import { resultCodeToHttpFunction } from "../../../common/helpers/resultCodeToHttpFunction";
import { STATUSES } from "../../../common/variables/variables";
import { DomainStatusCode } from "../../../common/types/types";

export const userRegistration = async (req: Request, res: Response) => {
  const { login, password, email } = req.body;
  const result = await authService.userRegistration(login, password, email);
  if (result.status !== DomainStatusCode.Success) {
    res.status(resultCodeToHttpFunction(result.status)).send(result.extensions);
    return;
  }
  res.sendStatus(STATUSES.NO_CONTENT_204);
};

import { Request, Response } from "express";
import { ConfirmationTypeWithBody } from "../types/authRequestResponseTypes";
import { authService } from "../services/authService";
import { resultCodeToHttpFunction } from "../../../common/helpers/resultCodeToHttpFunction";
import { DomainStatusCode } from "../../../common/types/types";
import { STATUSES } from "../../../common/variables/variables";

export const registrationConfirmation = async (
  req: Request<ConfirmationTypeWithBody>,
  res: Response,
) => {
  const confirmationCode: string = req.body.code;
  const result = await authService.registrationConfirm(confirmationCode);

  if (result.status !== DomainStatusCode.Success) {
    res
      .status(resultCodeToHttpFunction(result.status))
      .send({ errorsMessages: result.extensions });
    return;
  }
  res.sendStatus(STATUSES.NO_CONTENT_204);
};

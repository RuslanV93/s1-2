import { Request, Response } from "express";
import { authService } from "../services/authService";
import { EmailResendTypeWithBody } from "../types/authRequestResponseTypes";
import { resultCodeToHttpFunction } from "../../../common/helpers/resultCodeToHttpFunction";
import { DomainStatusCode } from "../../../common/types/types";
import { STATUSES } from "../../../common/variables/variables";

export const emailResending = async (
  req: Request<EmailResendTypeWithBody>,
  res: Response,
) => {
  const emailSendResult = await authService.emailResend(req.body.email);
  if (emailSendResult.status !== DomainStatusCode.Success) {
    res
      .status(resultCodeToHttpFunction(emailSendResult.status))
      .send({ errorsMessages: emailSendResult.extensions });
    return;
  }
  res.sendStatus(STATUSES.NO_CONTENT_204);
};

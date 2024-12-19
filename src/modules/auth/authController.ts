import { Router } from "express";
import {
  confirmationCodeValidator,
  inputValidationMiddleware,
  userEmailValidator,
  userLoginValidator,
  userPasswordValidator,
} from "../../validators/fieldsValidators";
import { loginUser } from "./handlers/loginUser";
import { authMe } from "./handlers/authMe";
import { accessTokenValidator } from "../../validators/authValidator";
import { userRegistration } from "./handlers/userRegistration";
import { registrationConfirmation } from "./handlers/registrationConfirmation";
import { emailResending } from "./handlers/emailResending";
export const authRouter = Router();

const authController = {
  loginUser,
  authMe,
  userRegistration,
  registrationConfirmation,
  emailResending,
};

authRouter.post(
  "/login",
  userPasswordValidator,
  userEmailValidator,
  userLoginValidator,
  inputValidationMiddleware,
  authController.loginUser,
);
authRouter.post(
  "/registration",
  userLoginValidator,
  userPasswordValidator,
  userEmailValidator,
  inputValidationMiddleware,
  authController.userRegistration,
);
authRouter.post(
  "/registration-confirmation",
  confirmationCodeValidator,
  inputValidationMiddleware,
  authController.registrationConfirmation,
);
authRouter.post(
  "/registration-email-resending",
  userEmailValidator,
  inputValidationMiddleware,
  authController.emailResending,
);
authRouter.get("/me", accessTokenValidator, authController.authMe);

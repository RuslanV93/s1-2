import { body, ValidationError, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

type ValidationErrorCustom = {
  message: string;
  field: string;
};

const blogFields = {
  id: 'id',
  name: 'name',
  description: 'description',
  websiteUrl: 'websiteUrl',
};
export const nameValidator = body(blogFields.name)
  .notEmpty()
  .withMessage('name is required')
  .isString()
  .trim()
  .isLength({ min: 1, max: 15 })
  .withMessage('name length must be between 1 and 15 characters');
export const descriptionValidator = body(blogFields.description)
  .notEmpty()
  .withMessage('desc is required')
  .isString()
  .trim()
  .isLength({ min: 1, max: 500 })
  .withMessage('desc length must bee between 1 and 15 characters');
export const webSiteUrlValidator = body(blogFields.websiteUrl)
  .notEmpty()
  .withMessage('website url is required')
  .isString()
  .trim()
  .isLength({ min: 3, max: 100 })
  .withMessage('website url length must be between 1 and 100 characters')
  .matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
  )
  .withMessage(
    "Invalid URL. Must start with 'https://' and contain a valid domain",
  );

export const inputValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors: Array<ValidationErrorCustom> = validationResult(req)
    .formatWith((error: ValidationError) => {
      if (error.type === 'field') {
        return { message: error.msg, field: error.path };
      } else {
        return { message: error.msg, field: 'unknown' };
      }
    })
    .array({ onlyFirstError: true });

  if (errors.length > 0) {
    res.status(400).send(errors);
    return;
  }
  next();
};

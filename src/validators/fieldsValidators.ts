import {
  body,
  param,
  ValidationChain,
  ValidationError,
  validationResult,
} from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { blogByIdExists } from './blogExistsCustomValidator';

import { STATUSES } from '../variables/variables';

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
const postFields = {
  title: 'title',
  shortDescription: 'shortDescription',
  content: 'content',
  blogId: 'blogId',
};

export const nameValidator = body(blogFields.name)
  .notEmpty()
  .withMessage('Name is required')
  .isString()
  .trim()
  .isLength({ min: 1, max: 15 })
  .withMessage('Name length must be between 1 and 15 characters');

export const descriptionValidator = body(blogFields.description)
  .notEmpty()
  .withMessage('Description is required')
  .isString()
  .trim()
  .isLength({ min: 1, max: 500 })
  .withMessage('Description length must bee between 1 and 15 characters');

export const webSiteUrlValidator = body(blogFields.websiteUrl)
  .notEmpty()
  .withMessage('Website url is required')
  .isString()
  .trim()
  .isLength({ min: 3, max: 100 })
  .withMessage('Website url length must be between 1 and 100 characters')
  .matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
  )
  .withMessage(
    "Invalid URL. Must start with 'https://' and contain a valid domain",
  );

export const titleValidator = body(postFields.title)
  .notEmpty()
  .withMessage('Title is required')
  .isString()
  .trim()
  .isLength({ min: 1, max: 30 })
  .withMessage('Title length must be between 1 and 30 chars');

export const shortDescriptionValidator = body(postFields.shortDescription)
  .notEmpty()
  .withMessage('Short description is required')
  .isString()
  .withMessage('Description must be string')
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage('Description must be between 1 and 100 chars');

export const contentValidator = body(postFields.content)
  .notEmpty()
  .withMessage('Content is required')
  .isString()
  .trim()
  .isLength({ min: 1, max: 1000 })
  .withMessage('Content must be between 1 and 1000 characters');

const blogIdValidation = (field: ValidationChain) => [
  field
    .optional()
    .notEmpty()
    .withMessage('Blog ID is required')
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Blog ID is required'),
];
export const blogIdValidator = [
  blogIdValidation(body(postFields.blogId)),
  blogIdValidation(param(postFields.blogId)),
  blogByIdExists(),
];

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
    const error = errors[0];
    if (error.message === 'Blog not found. Incorrect id.') {
      res.status(404).send({ errorsMessages: [error] });
      return;
    } else {
      res.status(STATUSES.BAD_REQUEST_400).send({ errorsMessages: errors });
      return;
    }
  }
  next();
};

import { RequestHandler } from "express";
import { ObjectSchema } from "joi";
import validation from "../../validation/joi/validation-schema";
import { ZenFitError } from "../../error/app-error";

type ValidateSchema = (schema: ObjectSchema) => RequestHandler;

const validateSchema: ValidateSchema = (schema) => (req, res, next) => {
  const error = validation(schema, req.body);

  if (!error) {
    return next();
  }

  res.status(400).json({ error });
};

const validateDataSchema: ValidateSchema = (schema) => (req, res, next) => {
  //If no data property in req.body throw error
  if (!("data" in req.body)) {
    throw new ZenFitError(
      "Bad request. Data is missing in the request body",
      400
    );
  }

  let data = {};
  try {
    //Parse the data
    data = JSON.parse(req.body.data);
  } catch (error) {
    res.status(400).json({ error });
    return;
  }

  const error = validation(schema, data);

  if (!error) {
    //If there was no error attached the parsed data to req.body.data
    req.body.data = data;
    return next();
  }

  res.status(400).json({ error });
};

export { validateSchema, validateDataSchema };

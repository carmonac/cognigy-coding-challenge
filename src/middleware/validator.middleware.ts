import { Request, Response, NextFunction } from "express";
import Ajv from "ajv";
import ajvErrors from "ajv-errors";

export const dataValidator =
  (schema: any, required: string[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const ajv = new Ajv({ allErrors: true });
    ajvErrors(ajv);
    schema.required = required;
    const validate = ajv.compile(schema);
    const data = { ...req.params, ...req.body };
    const valid = validate(data);
    if (!valid) {
      res.status(400).send(
        validate.errors?.map((e) => ({
          message: e.message,
        }))
      );
    } else {
      next();
    }
  };

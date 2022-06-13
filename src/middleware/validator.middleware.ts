import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../utils/errors";
import Ajv from "ajv";
import ajvErrors from "ajv-errors";

export const dataValidator =
  (schema: any, required: string[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const ajv = new Ajv({ allErrors: true });
    ajvErrors(ajv);
    schema.required = required;
    const validate = ajv.compile(schema);
    const data = { ...req.params, ...req.body };
    const valid = validate(data);
    if (!valid) {
      const errorMessage =
        validate.errors?.map((error) => error.message).join(", ") || "";
      next(new BadRequestError(errorMessage));
    } else {
      next();
    }
  };

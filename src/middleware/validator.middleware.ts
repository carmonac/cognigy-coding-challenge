import { Request, Response, NextFunction } from "express";
import Ajv from "ajv";

export const DataValidator =
  (schema: any) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const valid = validate(req.body);
    if (!valid) {
      res.status(400).send(validate.errors);
    } else {
      next();
    }
  };

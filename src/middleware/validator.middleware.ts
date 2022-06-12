import { Request, Response, NextFunction } from "express";
import Ajv from "ajv";

export const dataValidator =
  (schema: any) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const valid = validate(req.body);
    if (!valid) {
      res.status(400).send(
        validate.errors?.map((e) => ({
          property: e.propertyName,
          message: e.message,
        }))
      );
    } else {
      next();
    }
  };

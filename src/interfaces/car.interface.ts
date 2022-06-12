import { Document } from "mongoose";

export interface Car extends Document {
  readonly color: string;
  readonly year: number;
  readonly model: string;
  readonly hp: number;
  readonly price: number;
}

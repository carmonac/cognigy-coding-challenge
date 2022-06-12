import { Document } from "mongoose";

export interface ICar extends Document {
  readonly color: string;
  readonly year: number;
  readonly model: string;
  readonly hp: number;
  readonly price: number;
  readonly brand: string;
}

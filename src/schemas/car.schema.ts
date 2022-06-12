import * as mongoose from "mongoose";

// Car Schema (Mongoose)
export const CarSchema = new mongoose.Schema({
  color: String,
  model: String,
  price: Number,
  year: Number,
  hp: Number,
  brand: String,
});

// car data transfer object (DTO)
export const CarDTOSchema = {
  type: "object",
  properties: {
    _id: { type: "string" },
    color: { type: "string" },
    model: { type: "string" },
    year: { type: "number", maximum: new Date().getFullYear() },
    brand: { type: "string" },
    hp: { type: "number", minimum: 30, maximum: 500 },
    price: { type: "number" },
  },
  required: [],
  additionalProperties: false,
};

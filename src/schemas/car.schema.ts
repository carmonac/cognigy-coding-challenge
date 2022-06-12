import { Schema } from "mongoose";

// Car Schema (Mongoose)
export const CarSchema = new Schema({
  color: String,
  model: String,
  price: Number,
  year: Number,
  hp: Number,
  brand: String,
  createAt: { type: Date, default: Date.now },
});

// car data transfer object (DTO)
export const CarDTOSchema = {
  type: "object",
  properties: {
    // eslint-disable-next-line no-useless-escape
    id: { type: "string", pattern: "^[0-9a-fA-F]{24}$" },
    color: { type: "string" },
    model: { type: "string" },
    year: { type: "number", maximum: new Date().getFullYear() },
    brand: { type: "string" },
    hp: { type: "number", minimum: 30, maximum: 500 },
    price: { type: "number", minimum: 1000 },
  },
  required: [],
  additionalProperties: false,
  errorMessage: {
    properties: {
      id: "Invalid id",
      color: "Invalid color",
      model: "Invalid model",
      year: "Year must be less than current year",
      brand: "Invalid brand",
      hp: "Horsepower must be between 30 and 500",
      price: "Price must be greater than 1000",
    },
  },
};

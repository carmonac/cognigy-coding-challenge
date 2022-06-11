export const CarSchema = {
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
  required: ["color", "model", "year", "brand", "hp", "price"],
  additionalProperties: false,
};

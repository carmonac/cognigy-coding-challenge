export default {
  port: Number(process.env.PORT) || 3000,
  morganFormat: process.env.LOG_FORMAT || "combined", // ":method :url :status :res[content-length] - :response-time ms"
  apiKey: process.env.API_KEY || "cognigy.ai_123",
};

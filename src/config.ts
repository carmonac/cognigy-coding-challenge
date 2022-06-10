export default {
    port: Number(process.env.PORT) || 3000,
    morganFormat: "combined", // ":method :url :status :res[content-length] - :response-time ms"
};

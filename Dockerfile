FROM node:18.3.0-alpine AS build-env
WORKDIR /app

COPY . ./
RUN npm install
RUN npm run build


# Build runtime image
FROM node:18.3.0-alpine 
WORKDIR /app

RUN apk add dumb-init

ENV NODE_ENV="production"
ENV API_KEY="cognigy.ai_123"
ENV MONGO_URI="mongodb://mongo-database:27017/cars"

USER node

EXPOSE 3000

COPY --from=build-env /app/dist/src .
COPY --from=build-env /app/node_modules ./node_modules

CMD [ "dumb-init", "node", "index.js" ]
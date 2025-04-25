### Multi-stage build for billing service : nodejs image 

FROM node:22.14.0 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .

FROM node:22.14.0-alpine
WORKDIR /app
COPY --from=build /app .
CMD ["node", "server.js"]


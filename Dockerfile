FROM node:18-bullseye AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run buildProd

FROM nginx:bullseye
COPY --from=build /app/dist/ /usr/share/nginx/html
EXPOSE 80

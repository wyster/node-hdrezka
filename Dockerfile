ARG NODE_VERSION=14
FROM node:${NODE_VERSION}-slim

COPY . /app
WORKDIR /app

RUN npm install --production
CMD ["npm", "start"]

EXPOSE 80
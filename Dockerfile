FROM node:14-slim

COPY . /app
WORKDIR /app

RUN npm install --production
CMD ["npm", "start"]

EXPOSE 80
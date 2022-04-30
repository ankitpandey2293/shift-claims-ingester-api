FROM node:16.13.1

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

ARG DOCKER_ENV=testing
ENV NODE_ENV=$DOCKER_ENV

CMD ["npm", "run" ,"start"]
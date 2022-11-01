FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install
RUN npm i -g nodemon

COPY . .
EXPOSE 5003

ENTRYPOINT ["npm", "start"]
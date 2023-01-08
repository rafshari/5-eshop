FROM node:16

ENV NODE_ENV='production'

RUN  mkdir -p /eshop-server

WORKDIR /eshop-server

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
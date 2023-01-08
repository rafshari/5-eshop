FROM node:16 as build 

WORKDIR /eshop-client

COPY package.json /eshop-client/package.json

RUN npm install

RUN npm install react-scripts -g

COPY . /eshop-client

RUN npm run build

FROM nginx:1.16.0

COPY --from=build /eshop-client/build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx/nginx.conf /etc/nginx/conf.d 

EXPOSE 80 

CMD ["nginx","-g","daemon off;"]

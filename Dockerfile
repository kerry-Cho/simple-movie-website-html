FROM node:16.13.2-alpine
WORKDIR /usr/src/app
EXPOSE 8000

COPY package*.json ./
RUN npm install

ADD dist/ /usr/src/app/
ADD public/ /usr/src/app/public/

CMD [ "node", "bundle.js" ]

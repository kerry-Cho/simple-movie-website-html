FROM node:16.13.2-alpine
WORKDIR /usr/src/app
EXPOSE 8000

COPY package*.json ./
RUN npm install

ADD build/ /usr/src/app/build/
ADD dist/ /usr/src/app/

CMD [ "node", "bundle.js" ]

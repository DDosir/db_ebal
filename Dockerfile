FROM node:18.17-alpine3.17
# exactly the last half of your existing Dockerfile
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --force --verbose

COPY . .

EXPOSE 3000
CMD ["npm","start"]
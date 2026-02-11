FROM node:22.22-slim

WORKDIR /webapp

COPY package.json package-lock.json ./

RUN npm install pm2 -g
RUN npm ci
COPY . .

CMD ["pm2-runtime","dist/index.js"]
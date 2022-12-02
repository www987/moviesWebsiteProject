FROM node:14

WORKDIR /movies-app
COPY package.json .
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]


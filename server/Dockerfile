FROM node:14

WORKDIR /app

ENV PORT 80

COPY package.json /app/package.json

RUN npm install

COPY . /app

# replace ormconfig.json with ormconfig.docker.json
COPY ormconfig.docker.json /app/ormconfig.json

CMD ["npm", "run", "start--prod"]
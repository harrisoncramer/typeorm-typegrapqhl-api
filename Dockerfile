# Our application requires node.js to run. Use "alpine" version to get lighter Linux dependencies.
FROM node:15.4.0-alpine3.10
RUN apk add g++ make python

# Specify that when you create the container, put the application inside the /app container
WORKDIR /app

# Copy our package.json file into the /app folder (wildcard allows for package.lock.json)
COPY package*.json /app

RUN npm install 

# Copy source files + compilation configuration, db connection options, etc.
COPY ./src .
COPY tsconfig.json .
COPY ormconfig.js .
COPY modules.d.ts .

# This command will be overwritten to be start:production with our docker-compose.prod.yml file
CMD npm run start:development

EXPOSE $PORT

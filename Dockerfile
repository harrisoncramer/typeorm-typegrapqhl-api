# Our application requires node.js to run. Use "alpine" version to get lighter Linux dependencies.
FROM node:15.4.0-alpine3.10

# Specify that when you create the container, put the application inside the /app container
WORKDIR /app

# Copy our package.json + package-lock.json file into the /app folder (wildcard allows for package.lock.json)
COPY package*.json /app/

RUN npm ci 

# Copy source files + compilation configuration, db connection options, etc.
COPY ./src .
COPY tsconfig.json .
COPY ormconfig.js .
COPY modules.d.ts .

# This command will be overwritten to be start:production with our docker-compose.prod.yml file
CMD npm run start:development

EXPOSE 1234

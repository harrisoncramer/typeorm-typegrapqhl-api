# Our application requires node.js to run. Use "alpine" version to get lighter Linux dependencies.
FROM node:15.4.0-alpine3.10

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

# Simply pass the ENV=production variable to the docker-compose file
# and this command will be overwritten to be start:production
CMD npm run start:development

# NOTE: This application exposes port 3122, which you should also specify in your 
# environment files by default. If you don't you must change this to expose the API.
EXPOSE $PORT

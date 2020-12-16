# Our application requires node.js to run. Use "alpine" version to get lighter Linux dependencies.
FROM node:15.4.0-alpine3.10

# Specify that when you create the container, put the application inside the /app container
WORKDIR /app

# Copy our package.json file into the /app folder (wildcard allows for package.lock.json)
COPY package*.json /app

# Run your install
RUN npm install 

# Copy all files except for those specified in the .dockerignore file (node_modules)
COPY . .

# This is the command that executes when the file is run
CMD npm run start:production

# Expose the port that our application is running on (passed in .env.production file)
EXPOSE 3000

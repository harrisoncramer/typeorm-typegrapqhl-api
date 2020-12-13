# Our application requires node.js to run. Use "alpine" version to get lighter Linux dependencies.
FROM node:15.4.0-alpine3.10

# Specify that when you create the container, put the application inside the /app container
WORKDIR /app

# Copy our package.json file into the /app folder
COPY package.json /app

# Run your install
RUN npm install

# Copy all files except for those specified in the .dockerignore file (node_modules)
COPY . .

# Copy environment variables from production file when building docker image.
COPY .env.production .env.production

# Build and run the index file
CMD npm run start:prod

# Expose the port that our application is running on (passed in .env.production file)
EXPOSE 3000

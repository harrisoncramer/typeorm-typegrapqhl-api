#################
## FIRST STAGE ##
#################

# Our application requires node.js to run. Use "alpine" version to get lighter Linux dependencies.
FROM node:14.16.0 AS stage1
# Specify that when you create the container, put the application inside the /app container
WORKDIR /app
# Copy our package.json + package-lock.json file into the /app folder (wildcard allows for package.lock.json)
COPY package*.json /app/

# Install packages
RUN npm ci --only=production

# Copy source files + compilation configuration, db connection options, etc.
COPY ./src ./src
# Move over Typescript stuff for compilation
COPY tsconfig.json .
COPY ormconfig.js .
COPY modules.d.ts .

# Compile code
RUN npm run tsc

###################
### SECOND STAGE ##
###################

FROM gcr.io/distroless/nodejs:14-debug
COPY --from=stage1 /app /app
WORKDIR /app

# This command will be overwritten with our docker-compose.test.yml file
CMD ["./dist/index.js"]
EXPOSE 1234

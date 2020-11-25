import type { Serverless } from "serverless/aws";

const serverlessConfiguration: Serverless = {
  service: {
    name: "serverless-typescript-template",
  },
  package: {
    individually: true,
  },
  frameworkVersion: "2",
  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: true,
    },
  },
  plugins: [
    "serverless-webpack",
    "serverless-offline",
    "serverless-dotenv-plugin",
  ],
  provider: {
    name: "aws",
    runtime: "nodejs12.x",
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      secret: "${env:SECRET}",
    },
  },
  functions: {
    server: {
      handler: "index.server",
      events: [
        {
          http: {
            method: "post",
            path: "graphql",
            cors: true,
          },
        },
        {
          http: {
            method: "get",
            path: "graphql",
            cors: true,
          },
        },
      ],
    },
  },
};

module.exports = serverlessConfiguration;

# Aava-API integrations

This project provides sample applications that read data from integration sources and write to Aava-API. The applications are runnable as AWS Lambda or CLI.

The applications are provided both for direct use as runnable application in customer integrations, and as a demonstration for developing integrations for importing data to Aava-API from other HR systems.

This code is provided as-is, without any warranties.

# Implementations

## Serverless

Serverless implementation provides an AWS Lambda function for running the integration.

## CLI

The command-line interface implementation allows running the integration in any environment.

## Apollo-client

The Apollo-client implementation uses apollo-client to communicate with the GraphQL endpoint. This is the recommended method.

## REST

The REST client uses plain REST to communicate with the GraphQL API. This is useful if you want to keep external dependecies to minimum or need to implement the client using some other language.

# Codegen

# Integration API NestJS

## Description

The backend api service for the Integration Toolkit webpage. Build using NestJS & Mysql2.

## Updating

Ensure all tests in test.e2e pass before submitting pull requests. Any requests that fail test will not be merged!

## Deployment

Click the code dropdown and download the zip file. Extract the contents and copy them to the /sdev/API/MySQL_NestJS/integration-api-nestjs folder on the vm server.
Allow files to overwrite old file. Open a terminal and run:

```
npm run build
```

PM2 should detect the changes and automatically restart the service.

If any new node modules were added to the update, navigate to the main folder and run the following before build:

```
npm install
```

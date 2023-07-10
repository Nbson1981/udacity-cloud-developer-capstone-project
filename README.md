[![Build Status](https://app.travis-ci.com/Nbson1981/udacity-cloud-developer-capstone-project.svg?branch=main)](https://app.travis-ci.com/Nbson1981/udacity-cloud-developer-capstone-project)

# Functionality of the application

This api application will allow creating/removing/updating/fetching courses. Each course item can optionally have an  image. Each user only has access to the courses that he/she has owned.

- [x] **A user needs to authenticate in order to use an application home**
- [x] **The application allows users to create, update, delete/view course items.**
- [x] **The application allows users to upload a file.**
- [x] **The application only displays items/courses for a logged in user.**

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless TODO application.

# Postman collection

An alternative way to test your API, you can use the Postman collection that contains sample requests. You can find a Postman collection in this project. To import this collection, do the following.

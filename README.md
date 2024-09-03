<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

## Learning Management System (LMS) with Adaptive Testing

## Overview

This project is a Learning Management System (LMS) designed to manage and facilitate educational content, user interactions, and testing functionalities. It includes robust features for both administrators and users, leveraging a modern tech stack to ensure a seamless and scalable experience.

## Key Features

- **Adaptive Testing**: The system implements an adaptive testing algorithm that adjusts the difficulty of questions based on the user's performance. Initially, users are presented with questions of moderate difficulty, and subsequent questions are tailored according to their responses. Correct answers lead to more challenging questions, while incorrect answers trigger easier ones.
- **User and Admin Functionalities**: The LMS supports different roles with tailored functionalities. Users can register, take tests, and view their results, while administrators can manage questions, view user progress, and handle system settings.

- **Question Management**: Admins can create, update, and delete questions. Each question has associated metadata, including difficulty, weightage, and timestamps.

- **Scoring System**: The LMS tracks user performance and calculates scores based on question weightage. It updates scores dynamically and provides feedback on test results.

- **Secure Authentication**: The system uses JWT tokens for secure user authentication and authorization. Each user and admin has distinct access rights, ensuring secure and appropriate access to system features.
  .

## Installation

Clone it 👇👇

<p>git clone https://github.com/kuldeep-shr/lms_adaptive_test_backend</p>

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Seed Data

```bash
# generate json file for questioms
$ npm run generate-questions

# push all questions into database
$ npm run seed-questions

```

# API Endpoints

### Admin Side Endpoint

This endpoint allows you to register a new admin in the system.

### 1. Admin Register

`POST /auth/admin/register`

### Request Headers

- `Content-Type: application/json`

### Request Body

The request body should be a JSON object with the following fields:

- `name`: The name of the admin (string).
- `email`: The email address of the admin (string).
- `password`: The password for the admin (string).
- `isAdmin`: A boolean value indicating whether the user is an admin. Set this to `true` for admin registration.

### Example Request

```bash
curl --location 'http://localhost:8080/auth/admin/register' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "jaz",
    "email": "jaz@example.com",
    "password": "jaz@1234",
    "isAdmin": true
}'
```

### Example Response

```json
{
  "name": "jaz",
  "email": "jaz@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eXXXXXXXXXXXXXXXXXuNRwJj4E",
  "expiresIn": "24h"
}
```

### 2. Admin Login Endpoint

This endpoint allows an administrator to log in to the system and receive a JWT token for authentication.

### Endpoint

`POST /auth/admin/login`

### Request Headers

- `Content-Type: application/json`

### Request Body

The request body should be a JSON object with the following fields:

- `email`: The email address of the admin (string).
- `password`: The password of the admin (string).

### Example Request

```bash
curl --location 'http://localhost:8080/auth/admin/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "jaz@example.com",
    "password": "jaz@1234"
}'
```

### Example Response

```json
{
  "name": "jaz",
  "email": "jaz@example.com",
  "token": "eyJhbXXXXXXXXXXXXXXX1Dv1kmWvc",
  "expiresIn": "24h"
}
```

### 3. Create a New Question Endpoint

This endpoint allows an administrator to create a new question in the system.

### Endpoint

`POST /admin/questions`

### Request Headers

- `Authorization`: Bearer token for admin authentication. Replace the token with the JWT token obtained during login.
- `Content-Type: application/json`

### Request Body

The request body should be a JSON object with the following fields:

- `questionText`: The text of the question (string).
- `options`: An array of objects, each representing a possible answer. Each object should have an `option` field (string).
- `correctAnswer`: The correct answer for the question (string). This should match one of the `option` values.
- `weightage`: The weightage or score of the question (integer).

### Example Request

```bash
curl --location 'http://localhost:8080/admin/questions' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NXXXXXXXXXXXXXXXXXWvc' \
--header 'Content-Type: application/json' \
--data '{
    "questionText": "What is the capital of France?",
    "options": [
        {
            "option": "Paris"
        },
        {
            "option": "London"
        },
        {
            "option": "Berlin"
        }
    ],
    "correctAnswer": "Paris",
    "weightage": 5
}'
```

### Example Response

```json
{
  "questionText": "What is the capital of France?",
  "options": [
    {
      "option": "Paris",
      "_id": "66d625d05c8013bb83f3f16d"
    },
    {
      "option": "London",
      "_id": "66d625d05c8013bb83f3f16e"
    },
    {
      "option": "Berlin",
      "_id": "66d625d05c8013bb83f3f16f"
    }
  ],
  "correctAnswer": "Paris",
  "weightage": 5,
  "createdAt": "2024-09-02T20:53:36.973Z",
  "updatedAt": "2024-09-02T20:53:36.973Z",
  "_id": "66d625d05c8013bb83f3f16c",
  "__v": 0
}
```

### 4. Update a Question Endpoint

This endpoint allows an administrator to update an existing question in the system.

### Endpoint

`PATCH /admin/questions/:id`

- `:id` is the unique identifier of the question you want to update.

### Request Headers

- `Authorization`: Bearer token for admin authentication. Replace the token with the JWT token obtained during login.
- `Content-Type: application/json`

### Request Body

The request body should be a JSON object with the fields you want to update:

- `questionText`: The updated text of the question (string).
- `options`: An updated array of objects, each representing a possible answer. Each object should have an `option` field (string) and a `text` field (string) describing the option.
- `correctAnswer`: The updated correct answer for the question (string). This should match one of the `option` values.
- `weightage`: The updated weightage or score of the question (integer).

### Example Request

```bash
curl --location --request PATCH 'http://localhost:8080/admin/questions/66d5f26f8e82c6185cba22b4' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInXXXXXXXXXXXXXXXXX1MzA1NDkwfQ.VxfkVIpgel-Tp1IAzT9GvMR43MENrhHILFDFSlyhDD8' \
--data '{
    "questionText": "What is the capital of Germany?",
    "options": [
        {
            "option": "A",
            "text": "Berlin"
        },
        {
            "option": "B",
            "text": "Spain"
        },
        {
            "option": "C",
            "text": "Paris"
        }
    ],
    "correctAnswer": "A",
    "weightage": 10
}'
```

### Example Response

```json
Question with ID "66d5f26f8e82c6185cba22b4" updated successfully
```

### 5. Get a Specific Question Endpoint

This endpoint allows an administrator to retrieve details of a specific question using its unique ID.

### Endpoint

`GET /admin/questions/:id`

- `:id` is the unique identifier of the question you want to retrieve.

### Request Headers

- `Authorization`: Bearer token for admin authentication. Replace the token with the JWT token obtained during login.

### Example Request

```bash
curl --location 'http://localhost:8080/admin/questions/66d5f26f8e82c6185cba22b4' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXXXXXXXXXXXXDD8'
```

### Example Response

```json
{
  "_id": "66d5f26f8e82c6185cba22b4",
  "questionText": "Sample Question 2: What is 2 + 2?",
  "options": [
    {
      "option": "3",
      "_id": "66d5f26f8e82c6185cba22b5"
    },
    {
      "option": "4",
      "_id": "66d5f26f8e82c6185cba22b6"
    },
    {
      "option": "5",
      "_id": "66d5f26f8e82c6185cba22b7"
    }
  ],
  "correctAnswer": "4",
  "weightage": 5,
  "createdAt": "2024-09-02T17:14:23.649Z",
  "updatedAt": "2024-09-02T17:14:23.649Z",
  "__v": 0
}
```

### 6. Get All Questions Endpoint

This endpoint allows an administrator to retrieve a list of all questions in the system.

### Endpoint

`GET /admin/questions`

### Request Headers

- `Authorization`: Bearer token for admin authentication. Replace the token with the JWT token obtained during login.

### Example Request

```bash
curl --location 'http://localhost:8080/admin/questions/' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsXXXXXXXXXXXhDD8'
```

### Example Response

```json
[
    {
        "_id": "66d5f26f8e82c6185cba22b4",
        "questionText": "Sample Question 2: What is 2 + 2?",
        "options": [
            {
                "option": "3",
                "_id": "66d5f26f8e82c6185cba22b5"
            },
            {
                "option": "4",
                "_id": "66d5f26f8e82c6185cba22b6"
            },
            {
                "option": "5",
                "_id": "66d5f26f8e82c6185cba22b7"
            }
        ],
        "correctAnswer": "4",
        "weightage": 5,
        "createdAt": "2024-09-02T17:14:23.649Z",
        "updatedAt": "2024-09-02T17:14:23.649Z",
        "__v": 0
    }
    .
    .
    .
    .
    .more
],
```

### 7. Delete a Question Endpoint

This endpoint allows an administrator to delete a specific question using its unique ID.

### Endpoint

`DELETE /admin/questions/:id`

- `:id` is the unique identifier of the question you want to delete.

### Request Headers

- `Authorization`: Bearer token for admin authentication. Replace the token with the JWT token obtained during login.

### Example Request

```bash
curl --location --request DELETE 'http://localhost:8080/admin/questions/66d625d05c8013bb83f3f16c' \
--header 'Authorization: Bearer eyJhbGciOiJIUzXXXXXXXXXXXv1kmWvc'
```

### Example Response

```json
Question with ID "66d625d05c8013bb83f3f16c" deleted successfully
```

### 8.Get Questions for a Specific Test Endpoint

This endpoint allows an administrator to retrieve all questions associated with a specific test using its unique ID.

### Endpoint

`GET /admin/questions/tests/:testId`

- `:testId` is the unique identifier of the test for which you want to retrieve questions.

### Request Headers

- `Authorization`: Bearer token for admin authentication. Replace the token with the JWT token obtained during login.
- `Content-Type`: `application/json`

### Example Request

```bash
curl --location 'http://localhost:8080/admin/questions/tests/25669509-2e8d-4915-a8ee-2369cef57e1a' \
--header 'Authorization: Bearer eyJhbGciOiJXXXXXXXXXXXXXXXRaazx1uVzg14' \
--header 'Content-Type: application/json'
```

### Example Response

```json
{
  "user": {
    "id": "66d5eff383f57ff16aec109f",
    "name": "Dummy"
  },
  "questionDetails": [
    {
      "questionId": "66d5f26f8e82c6185cba231c",
      "questionText": "Sample Question 28: What is 28 + 28?",
      "correctAnswer": "56",
      "options": [
        {
          "option": "55",
          "_id": "66d5f26f8e82c6185cba231d"
        },
        {
          "option": "56",
          "_id": "66d5f26f8e82c6185cba231e"
        },
        {
          "option": "57",
          "_id": "66d5f26f8e82c6185cba231f"
        }
      ],
      "userSelected": "55",
      "isCompleted": true,
      "date": "2024-09-02T20:14:29.868Z"
    },
    {
      "questionId": "66d5f26f8e82c6185cba2304",
      "questionText": "Sample Question 22: What is 22 + 22?",
      "correctAnswer": "44",
      "options": [
        {
          "option": "43",
          "_id": "66d5f26f8e82c6185cba2305"
        },
        {
          "option": "44",
          "_id": "66d5f26f8e82c6185cba2306"
        },
        {
          "option": "45",
          "_id": "66d5f26f8e82c6185cba2307"
        }
      ],
      "userSelected": "44",
      "isCompleted": true,
      "date": "2024-09-02T20:15:51.828Z"
    }
  ],
  "testId": "66d61c55c63db25249c40d3d",
  "testUrl": "25669509-2e8d-4915-a8ee-2369cef57e1a",
  "testDate": "2024-09-02T20:13:09.624Z",
  "score": 1,
  "totalObtainedScore": 6
}
```

<br />

<br />

### User Side Endpoint

This endpoint allows you to register a new user in the system.

### 1. User Register

`POST /auth/user/register`

### Request Headers

- `Content-Type: application/json`

### Request Body

The request body should be a JSON object with the following fields:

- `name`: The name of the user (string).
- `email`: The email address of the user (string).
- `password`: The password for the user (string).
- `isAdmin`: A boolean value indicating whether the user is an admin (`true` for admin, `false` for regular user).

### Example Request

```bash
curl --location 'http://localhost:8080/auth/user/register' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Dummy",
    "email": "dummy@example.com",
    "password": "Dummy@12345",
    "isAdmin": false
}'

```

### Example Response

```json
{
  "name": "Dummy",
  "email": "dummy@example.com",
  "token": "eyJhbGciOiJIUzI1NiIXXXXXXXXXXXXXXXXXXXXXXXXXXXXXv4CBNk",
  "expiresIn": "24h"
}
```

### 2. User Login Endpoint

This endpoint allows you to login a user in the system.

### Endpoint

`POST /auth/user/login`

### Request Headers

- `Content-Type: application/json`

### Request Body

The request body should be a JSON object with the following fields:

- `email`: The email address of the user (string).
- `password`: The password for the user (string).

### Example Request

```bash
curl --location 'http://localhost:8080/auth/user/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "dummy@example.com",
    "password": "Dummy@12345"
}'

```

### Example Response

```json
{
  "name": "Dummy",
  "email": "dummy@example.com",
  "token": "eyJhbXXXXXXXXXXXXXXXXXXXXXXXXlmCcA8",
  "expiresIn": "24h"
}
```

### 3. Get Unique URL for test

This endpoint allows you to create unique URL for test.

### Endpoint

`GET /user/tests/`

### Request Headers

- `Content-Type: application/json`

### Request Body

> NONE

### Example Request

```bash
curl --location 'http://localhost:8080/user/tests/' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGXXXXXXXXXXXXXXXXXXXXXXXXXLY4Q8'

```

### Example Response

```json
{
  "testUrl": "adc5a5fd-567d-463d-a91a-58724fa92956",
  "isExpired": false
}
```

### 4. Start test

This endpoint allows you to start the test.

### Endpoint

`GET /user/tests/<testUrl>/start`

### Request Headers

- `Content-Type: application/json`

### Request Body

> NONE

### Example Request

```bash
curl --location 'http://localhost:8080/user/tests/<testUrl>/start' \
--header 'Authorization: Bearer eyJhbXXXXXXXXXXXXXXXXXXXXXXXXXXXLY4Q8' \
--header 'Content-Type: application/json'

```

### Example Response

```json
{
  "_id": "66d56f8d418e5ce42699ac7c",
  "questionText": "Sample Question 35: What is 35 + 35?",
  "options": [
    {
      "option": "69"
    },
    {
      "option": "70"
    },
    {
      "option": "71"
    }
  ],
  "weightage": 5
}
```

### 5. Post answer

This endpoint allows you to post the answer.

### Endpoint

`POST /user/<testUrl>/questions/<questionId>/answer`

### Request Headers

- `Content-Type: application/json`

### Request Body

- `option`: The option provided by the user (string).
- `isAttempted`: Is user attempted the question or not (string).

### Example Request

```bash
curl --location 'http://localhost:8080/user/<testUrl>/questions/<questionId>/answer' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhXXXXXXXXXXXXXXXXXXLY4Q8' \
--data '{
    "option": "103",
    "isAttempted": true
}'

```

### Example Response

```json
{
  "message": "Answer submitted successfully",
  "score": 0,
  "totalObtainedScore": 5,
  "testCompleted": false,
  "percentage": 0
}
```

## For API collection, hit below button:

[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://app.getpostman.com/run-collection/30468072-2e667b11-1323-41ef-9244-39b3ddc4037c?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D30468072-2e667b11-1323-41ef-9244-39b3ddc4037c%26entityType%3Dcollection%26workspaceId%3D95aff678-647e-45b5-b7f2-68fb4adf621f)

## Stay in touch for any changes or .env file and their structure

```bash
DATABASE <string>
JWT_SECRET_USER <string>
JWT_SECRET_ADMIN <string>
PORT <PORT>
```

- Author - [Kuldeep Sharma](https://github.com/kuldeep-shr)
- Email - [Kuldeep Sharma](kuldeepsharma211097@gmail.com)

## License

Nest is [MIT licensed](LICENSE).

```

```

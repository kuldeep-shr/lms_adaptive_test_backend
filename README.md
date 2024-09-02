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

## API Endpoints

### User Registration Endpoint

This endpoint allows you to register a new user in the system.

### 1. Endpoint

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
curl --location 'http://localhost:3000/auth/user/register' \
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
  "token": "eyJhbGXXXXXXXXXXXXXXXXXXXXXXXXXX4YW1w",
  "expiresIn": "1h"
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
curl --location 'http://localhost:3000/auth/user/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "dummy@example.com",
    "password": "Dummy@12345"
}'

```

### Example Response

```json
{
  "email": "dummy@example.com",
  "token": "eyJhbXXXXXXXXXXXXXXXXXXXXXXXXlmCcA8",
  "expiresIn": "1h"
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
curl --location 'http://localhost:3000/user/tests/' \
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
curl --location 'http://localhost:3000/user/tests/<testUrl>/start' \
--header 'Authorization: Bearer eyJhbXXXXXXXXXXXXXXXXXXXXXXXXXXXLY4Q8' \
--header 'Content-Type: application/json'

```

### Example Response

```json
[
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
]
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
curl --location 'http://localhost:3000/user/<testUrl>/questions/<questionId>/answer' \
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
  "isCorrect": false,
  "score": 0,
  "totalObtainedScore": 5,
  "testCompleted": false,
  "percentage": 0
}
```

## For API collection, hit below button:

[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://app.getpostman.com/run-collection/30468072-2e667b11-1323-41ef-9244-39b3ddc4037c?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D30468072-2e667b11-1323-41ef-9244-39b3ddc4037c%26entityType%3Dcollection%26workspaceId%3D95aff678-647e-45b5-b7f2-68fb4adf621f)

## Stay in touch for any changes or .env file

- Author - [Kuldeep Sharma](https://github.com/kuldeep-shr)
- Email - [Kuldeep Sharma](kuldeepsharma211097@gmail.com)

## License

Nest is [MIT licensed](LICENSE).

```

```

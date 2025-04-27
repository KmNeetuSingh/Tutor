# API Testing Script

This script tests the Tutor API endpoints for the request functionality.

## Prerequisites

- Node.js installed
- The backend server running on http://localhost:5000

## Setup

1. Install dependencies:
```
npm install
```

2. Make sure your backend server is running:
```
cd Backend
npm start
```

## Running the Tests

Run the test script:
```
npm test
```

## What the Test Does

The test script performs the following operations:

1. Registers a student user
2. Logs in as the student and gets a token
3. Creates a tutoring request (as a student)
4. Gets all requests
5. Registers a tutor user
6. Logs in as the tutor and gets a token
7. Applies to the request (as a tutor)
8. Schedules a session (as a tutor)

## Manual Testing

You can also test the API manually using tools like Postman or curl:

1. Register a user:
```
POST http://localhost:5000/api/users/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "role": "student"
}
```

2. Login to get a token:
```
POST http://localhost:5000/api/users/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

3. Create a request (with token):
```
POST http://localhost:5000/api/requests
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "subject": "Mathematics",
  "description": "Need help with calculus"
}
```

4. Get all requests:
```
GET http://localhost:5000/api/requests
Authorization: Bearer YOUR_TOKEN_HERE
```

5. Apply to a request (as tutor):
```
POST http://localhost:5000/api/requests/apply/REQUEST_ID
Authorization: Bearer TUTOR_TOKEN_HERE
```

6. Schedule a session:
```
POST http://localhost:5000/api/requests/schedule/REQUEST_ID
Content-Type: application/json
Authorization: Bearer TUTOR_TOKEN_HERE

{
  "scheduledDate": "2023-12-01T14:00:00.000Z"
}
```
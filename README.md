# TechPrep Backend API

A production-ready backend for a tech interview preparation platform, built with the **MERN stack** (Node.js, Express.js, MongoDB) and **Firebase Authentication**.

Users can log in, select a plan (Free / Pro / Premium), and access specific questions and answers based on their subscription tier. All access control logic is strictly enforced at the backend level.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites Setup](#prerequisites-setup)
- [Local Setup](#local-setup)
- [API Documentation](#api-documentation)
- [Testing with Postman / curl](#testing-with-postman--curl)
- [Access Control Matrix](#access-control-matrix)
- [Deployment](#deployment)

---

## Tech Stack

| Technology     | Purpose                    |
|----------------|----------------------------|
| Node.js        | Runtime environment        |
| Express.js     | Web framework              |
| MongoDB        | Database (via Mongoose)    |
| Firebase Admin | Authentication (ID tokens) |
| Swagger        | API documentation          |

---

## Features

- **Firebase Authentication**: Seamless integration using the Firebase Admin SDK. ID tokens are verified on every protected request.
- **Automated Provisioning**: Auto-creation of user records on first login, defaulting to a `free` plan.
- **Subscription Tiers**: Robust tier system supporting `free`, `pro`, and `premium` accounts.
- **Mock Payment Flow**: Dedicated endpoint for handling plan upgrades and simulating successful transactions.
- **Role-Based Access Control**: Questions and premium contents are restricted based on the user's plan.
- **Clean Architecture**: Adherence to best practices with clear separation between routes, controllers, services, and models.
- **Interactive Documentation**: Built-in Swagger UI for easy API testing and exploration.

---

## Project Structure

```text
techprep-backend/
├── src/
│   ├── config/
│   │   ├── db.js                 # MongoDB connection logic
│   │   └── firebase.js           # Firebase Admin SDK initialization
│   ├── middleware/
│   │   ├── auth.js               # Firebase token verification
│   │   └── accessControl.js      # Role-based access matrix
│   ├── models/
│   │   ├── User.js               # Mongoose schema for users
│   │   └── Question.js           # Mongoose schema for questions
│   ├── controllers/
│   │   ├── authController.js     # User profile endpoint handler
│   │   ├── planController.js     # Plan upgrade handler
│   │   └── questionController.js # Content delivery endpoints
│   ├── services/
│   │   ├── userService.js        # Core user business logic
│   │   ├── planService.js        # Upgrade and mock transaction handling
│   │   └── questionService.js    # Data retrieval and access enforcement
│   ├── routes/
│   │   ├── authRoutes.js         # /auth routes
│   │   ├── planRoutes.js         # /select-plan routes
│   │   └── questionRoutes.js     # /questions routes
│   ├── seeds/
│   │   └── seedQuestions.js      # Utility script for database population
│   └── app.js                    # Express application setup
├── server.js                     # Main entry point
├── swagger.js                    # OpenAPI specification
├── .env.example                  # Environment configuration template
├── .gitignore                    # Git tracking exclusions
└── package.json                  # Dependencies and NPM scripts
```

---

## Prerequisites Setup

### 1. Firebase Project Setup

1. Navigate to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. In the sidebar, select **Build -> Authentication** and click **Get started**.
3. Enable the **Email/Password** sign-in method.
4. Open the **Project settings** (gear icon), navigate to the **Service accounts** tab, and select **Node.js**.
5. Click **Generate new private key** and download the resulting JSON file.
6. Rename the file to `serviceAccountKey.json` and place it in the root of your project directory.
7. Note your **Web API Key** from the **General** tab for API testing.

### 2. MongoDB Atlas Setup

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
2. Build a new Database using the free tier.
3. In **Database Access**, create a user and save the credentials.
4. In **Network Access**, add `0.0.0.0/0` to allow connections from your environment.
5. Click **Connect -> Drivers** to obtain your connection string, replacing `<username>` and `<password>` with your created credentials.

---

## Local Setup

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd techprep-backend

# 2. Install required packages
npm install

# 3. Configure environment variables
cp .env.example .env
# Open .env and insert your MONGO_URI and FIREBASE_SERVICE_ACCOUNT_PATH

# 4. Insert your Firebase credentials
# Place your downloaded serviceAccountKey.json file in the root directory

# 5. Populate the database
npm run seed

# 6. Start the development server
npm run dev
```

The API will be available at `http://localhost:5000`.

---

## API Documentation

### Base URL
```text
http://localhost:5000
```

### Authentication
All protected endpoints require a valid Firebase ID token sent in the headers:
```text
Authorization: Bearer <firebase_id_token>
```

### Endpoints Overview

| Method | Endpoint          | Auth Required | Description                                          |
|--------|-------------------|---------------|------------------------------------------------------|
| GET    | `/`               | No            | Base API status configuration                        |
| GET    | `/health`         | No            | Infrastructure health check                          |
| GET    | `/api-docs`       | No            | Interactive Swagger documentation UI                 |
| GET    | `/auth/profile`   | Yes           | Retrieve the current authenticated user's data       |
| POST   | `/select-plan`    | Yes           | Upgrade subscription (Body: `{ "plan": "pro" }`)     |
| GET    | `/questions`      | Yes           | Fetch questions (determines `isLocked` by plan)      |
| GET    | `/questions/:id`  | Yes           | Fetch question details (answer withheld if tier low) |

---

## Testing with Postman / curl

### Step 1: Obtain a Firebase ID Token

Use the Firebase REST API to authenticate a test user:

```bash
# Sign in an existing user
curl -X POST "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=YOUR_WEB_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456","returnSecureToken":true}'
```

Copy the `idToken` from the response body.

### Step 2: Test Protected APIs

```bash
# List all questions
curl -H "Authorization: Bearer YOUR_ID_TOKEN" http://localhost:5000/questions

# Fetch a specific question
curl -H "Authorization: Bearer YOUR_ID_TOKEN" http://localhost:5000/questions/QUESTION_ID

# Upgrade user to premium tier
curl -X POST http://localhost:5000/select-plan \
  -H "Authorization: Bearer YOUR_ID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"plan":"premium"}'
```

---

## Access Control Matrix

| Subscription Plan | View Questions | View Answers | Access Premium Content |
|-------------------|----------------|--------------|------------------------|
| Free              | Yes            | No           | No                     |
| Pro               | Yes            | Yes          | No                     |
| Premium           | Yes            | Yes          | Yes                    |

**Backend Enforcement:**
- Core logic is strictly modularized in `accessControl.js` and enforced inside `questionService.js`.
- The `plan` property is queried directly from the Mongo database for every request, preventing payload manipulation.
- Authentication tokens are rigorously validated using the Firebase Admin SDK.

---

## Deployment

The application runs seamlessly on Node.js hosting providers such as **Render**.

1. Create a **New Web Service** and connect your GitHub repository.
2. Set Build Command to `npm install` and Start Command to `npm start`.
3. Configure your Environment Variables (`MONGO_URI`, `PORT`).
4. Upload your `serviceAccountKey.json` as a secret file and map it to `FIREBASE_SERVICE_ACCOUNT_PATH`.
5. Deploy.

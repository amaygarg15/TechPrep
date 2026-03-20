#  TechPrep Backend API

A production-ready backend for a tech interview preparation platform, built with the **MERN stack** (Node.js, Express.js, MongoDB) and **Firebase Authentication**.

Users can log in, select a plan (Free / Pro / Premium), and access questions and answers based on their plan tier — with all access control enforced at the backend level.

---

##  Table of Contents

- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Prerequisites Setup](#-prerequisites-setup)
  - [Firebase Project](#1-firebase-project-setup)
  - [MongoDB Atlas](#2-mongodb-atlas-setup)
- [Local Setup](#-local-setup)
- [API Documentation](#-api-documentation)
- [Testing with Postman / curl](#-testing-with-postman--curl)
- [Access Control Matrix](#-access-control-matrix)
- [Deployment](#-deployment)

---

##  Tech Stack

| Technology     | Purpose                    |
|----------------|----------------------------|
| Node.js        | Runtime environment        |
| Express.js     | Web framework              |
| MongoDB        | Database (via Mongoose)    |
| Firebase Admin | Authentication (ID tokens) |
| Swagger        | API documentation          |

---

##  Features

-  Firebase Authentication (ID token verification — never skipped)
-  Auto-creation of user on first login (default: free plan)
-  Plan system: Free → Pro → Premium
-  Mock payment flow for plan upgrades
-  Questions API with plan-based access control
-  Answers restricted by plan tier (enforced at backend)
-  Premium content gating
-  Swagger API documentation at `/api-docs`
-  Proper error handling and edge cases
-  Clean architecture (routes → controllers → services → models)

---

##  Project Structure

```
techprep-backend/
├── src/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── firebase.js        # Firebase Admin SDK init
│   ├── middleware/
│   │   ├── auth.js            # Firebase token verification + auto-create user
│   │   └── accessControl.js   # Plan-based access control matrix
│   ├── models/
│   │   ├── User.js            # User schema (firebase_uid, email, plan)
│   │   └── Question.js        # Question schema (title, difficulty, answer)
│   ├── controllers/
│   │   ├── authController.js  # Profile endpoint handler
│   │   ├── planController.js  # Plan selection handler
│   │   └── questionController.js # Questions/answers handler
│   ├── services/
│   │   ├── userService.js     # User DB operations
│   │   ├── planService.js     # Plan upgrade + mock payment logic
│   │   └── questionService.js # Question retrieval + access checks
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── planRoutes.js
│   │   └── questionRoutes.js
│   ├── seeds/
│   │   └── seedQuestions.js   # Seed 15 mock questions into DB
│   └── app.js                 # Express app configuration
├── server.js                  # Entry point
├── swagger.js                 # Swagger/OpenAPI config
├── .env.example               # Environment variable template
├── .gitignore
├── package.json
└── README.md
```

---

##  Prerequisites Setup

### 1. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/) → **Create a project** (e.g. `techprep-backend`).
2. Disable Google Analytics (optional) → **Create project**.
3. Go to **Build → Authentication → Get started**.
4. Enable **Email/Password** sign-in method.
5. **Generate Service Account key**:
   - Click  gear → **Project settings** → **Service accounts** tab.
   - Select **Firebase Admin SDK** → **Node.js**.
   - Click **"Generate new private key"** → download the `.json` file.
   - Rename it to `serviceAccountKey.json` and place it in the project root.
6. Note your **Web API Key** (Project settings → General tab) — needed for testing.

>  **Never commit `serviceAccountKey.json` to Git.** It's already in `.gitignore`.

---

### 2. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) → create a free account.
2. Click **"Build a Database"** → choose **M0 FREE** tier → create.
3. **Database Access**: Create a user with username & password.
4. **Network Access**: Add IP → **Allow Access from Anywhere** (`0.0.0.0/0`).
5. **Get connection string**: Click **Connect → Drivers** → copy the URI:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/techprep?retryWrites=true&w=majority
   ```
   Replace `<username>` and `<password>` with your database user credentials.

---

##  Local Setup

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd techprep-backend

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env
# Edit .env and fill in your MONGO_URI and FIREBASE_SERVICE_ACCOUNT_PATH

# 4. Place your Firebase service account key
# Copy the downloaded JSON as serviceAccountKey.json in the project root

# 5. Seed the database with mock questions
npm run seed

# 6. Start the server
npm run dev
```

The server will start at `http://localhost:5000`.  
API docs available at `http://localhost:5000/api-docs`.

---

##  API Documentation

### Base URL
```
http://localhost:5000
```

### Authentication
All endpoints (except `/`, `/health`, `/api-docs`) require a Firebase ID token:
```
Authorization: Bearer <firebase_id_token>
```

### Endpoints

| Method | Endpoint          | Auth | Description                                          |
|--------|-------------------|------|------------------------------------------------------|
| GET    | `/`               |    | API info & available endpoints                       |
| GET    | `/health`         |    | Health check                                         |
| GET    | `/api-docs`       |    | Swagger documentation UI                             |
| GET    | `/auth/profile`   |    | Get authenticated user's profile                     |
| POST   | `/select-plan`    |    | Upgrade plan (body: `{ "plan": "pro" or "premium" }`) |
| GET    | `/questions`      |    | List all questions (with `isLocked` flag)            |
| GET    | `/questions/:id`  |    | Get question detail (answer only if plan allows)     |

### Response Examples

**GET /questions** (as free user):
```json
{
  "success": true,
  "count": 15,
  "data": [
    {
      "id": "64abc...",
      "title": "What is the event loop in Node.js?",
      "difficulty": "easy",
      "isPremium": false,
      "isLocked": true
    }
  ]
}
```

**GET /questions/:id** (access denied):
```json
{
  "success": false,
  "data": {
    "id": "64abc...",
    "title": "What is the event loop in Node.js?",
    "difficulty": "easy",
    "isPremium": false,
    "isLocked": true
  },
  "message": "Upgrade your plan to access this content"
}
```

**POST /select-plan**:
```json
{
  "success": true,
  "message": "Successfully upgraded to pro plan",
  "data": {
    "user": {
      "firebase_uid": "abc123",
      "email": "user@example.com",
      "plan": "pro",
      "plan_activated_at": "2025-01-15T10:30:00.000Z"
    },
    "payment": {
      "transaction_id": "txn_1705312200_x7k2m",
      "status": "success",
      "plan": "pro",
      "amount": 999,
      "currency": "USD"
    }
  }
}
```

---

##  Testing with Postman / curl

### Step 1: Get a Firebase ID Token

Use the Firebase Auth REST API:

```bash
# Sign up a new test user
curl -X POST "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=YOUR_WEB_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456","returnSecureToken":true}'

# Or sign in an existing user
curl -X POST "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=YOUR_WEB_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456","returnSecureToken":true}'
```

Copy the `idToken` from the response.

### Step 2: Test the APIs

```bash
# Get profile (auto-creates user on first call)
curl -H "Authorization: Bearer YOUR_ID_TOKEN" http://localhost:5000/auth/profile

# List questions
curl -H "Authorization: Bearer YOUR_ID_TOKEN" http://localhost:5000/questions

# Get specific question
curl -H "Authorization: Bearer YOUR_ID_TOKEN" http://localhost:5000/questions/QUESTION_ID

# Upgrade to pro
curl -X POST http://localhost:5000/select-plan \
  -H "Authorization: Bearer YOUR_ID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"plan":"pro"}'

# Upgrade to premium
curl -X POST http://localhost:5000/select-plan \
  -H "Authorization: Bearer YOUR_ID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"plan":"premium"}'
```

---

##  Access Control Matrix

| Plan    | View Questions | View Answers | Premium Content |
|---------|---------------|--------------|-----------------|
| Free    |             |            |               |
| Pro     |             |            |               |
| Premium |             |            |               |

**Enforcement rules:**
- Access control is enforced **at the backend** in `accessControl.js` and `questionService.js`
- User plan is read **from the database** (never hardcoded)
- Firebase token verification is **always performed** (never skipped)
- Unsecured endpoints → only `/`, `/health`, and `/api-docs`

---

##  Deployment

### Deploy to Render (Recommended)

1. Push code to GitHub.
2. Go to [Render](https://render.com) → **New Web Service** → connect your repo.
3. Settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add environment variables: `MONGO_URI`, `PORT`, `FIREBASE_SERVICE_ACCOUNT_PATH`
5. For Firebase, either:
   - Upload the service account JSON as a file, OR
   - Set the content as an env variable and adjust `firebase.js` to parse it

### Other options
- **Railway**: Similar to Render — connect GitHub, add env vars, deploy.
- **Heroku**: Use `heroku create`, set config vars, `git push heroku main`.

---

##  Environment Variables

| Variable                      | Required | Description                          |
|-------------------------------|----------|--------------------------------------|
| `MONGO_URI`                   | Yes      | MongoDB Atlas connection string      |
| `PORT`                        | No       | Server port (default: 5000)          |
| `FIREBASE_SERVICE_ACCOUNT_PATH` | Yes   | Path to Firebase service account JSON |

---

##  What This Project Does NOT Do

-  Skip Firebase token verification
-  Hardcode user roles or responses
-  Expose unsecured endpoints (all data routes are protected)
-  Use any stack other than MERN
-  Put all logic in a single file

---

##  License

ISC

# Secure Backend API & Anonymous Messaging System

A robust, production-ready Node.js and Express backend application featuring advanced authentication flows, Redis caching, rate limiting, and an interactive **Anonymous Messaging & Private Conversation System**. Built with modular architecture, strict Zod validation, and robust security practices.

---

## 🚀 Key Features

* **Advanced Authentication & Security:**
  * Local registration, sign-in, and password reset with email-based OTP verification.
  * **Two-Step Verification (2FA/OTP):** Secure second-factor authentication for logins managed via Redis cache.
  * **Google OAuth Integration:** Seamless sign-in with Google tokens.
  * **JWT-Based Token Management:** Short-lived Access Tokens (`15m`) and long-lived Refresh Tokens (`7d`) stored in HTTP-only cookies.
  * **Password Hashing:** Secure password encryption using `bcrypt`.

* **Anonymous Messaging & Identity Request System:**
  * **Send Anonymous Messages:** Users can send messages to others without revealing their identity.
  * **Identity Requests:** Message receivers can request to reveal the sender's identity.
  * **Accept/Reject Requests:** Senders can accept or reject identity reveal requests.
  * **Private Conversations:** Accepting an identity request automatically unlocks a private chat room linked directly to the original message.

* **Performance & Scalability:**
  * **Redis Caching Middleware:** Speeds up frequent API responses and reduces MongoDB load.
  * **Idempotency Middleware:** Prevents duplicate requests (e.g., password resets) using custom idempotency headers.

* **Protection & Rate Limiting:**
  * **Rate Limiting:** Route-specific protection against brute-force attacks on sensitive endpoints (e.g., login, OTP verification).
  * **File Upload & Magic-Number Validation:** Secure file uploads via `multer` backed by strict MIME-type checking (`file-type`).

---

## 🛠️ Tech Stack

* **Runtime:** Node.js (ES Modules)
* **Framework:** Express.js
* **Database:** MongoDB & Mongoose (Atlas compatible)
* **Caching & Store:** Redis (`ioredis`)
* **Validation:** Zod
* **Authentication:** JSON Web Tokens (`jsonwebtoken`), Google Auth Library
* **Email Service:** Nodemailer
* **Security & Utilities:** `bcrypt`, `express-rate-limit`, `cookie-parser`, `cors`, `multer`, `file-type`

---

## 📂 Project Architecture

```text
src/
├── app/
│   ├── auth/          # Authentication & 2FA module
│   ├── message/       # Anonymous messaging, requests, & conversations module
│   └── user/          # User management module
├── lib/               # Core utilities (Cache, DB, Email, JWT, Security, Middlewares)
├── pkg/               # Reusable packages (AppError, Logger, Multer, Utils)
├── app.js             # Express app & global middleware setup
├── routes.js          # Central router definition
└── server.js          # HTTP server entry point & graceful shutdown
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory of your project:

```env
PORT = 3000
DATABASE_URL = "mongodb://your_mongodb_connection_string"
JWT_SECRET = "your_access_token_secret"
JWT_REFRESH_SECRET = "your_refresh_token_secret"
EMAIL_USER = "your_email@gmail.com"
EMAIL_PASS = "your_email_app_password"
CLIENT_ID = "your_google_client_id.apps.googleusercontent.com"
REDIS_HOST = "localhost"
REDIS_PORT = "6379"
REDIS_PASSWORD = ""
```

---

## 📥 Getting Started

### Prerequisites
Make sure you have installed:
* [Node.js](https://nodejs.org/) (v18+ recommended)
* [MongoDB](https://www.mongodb.com/) (Local or MongoDB Atlas)
* [Redis](https://redis.io/) server running locally or remotely.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the application:**
   * **Development Mode:**
     ```bash
     npm run dev
     ```
   * **Production Mode:**
     ```bash
     npm start
     ```

---

## 🔌 API Endpoints Overview

### 🔐 **Authentication Routes (`/api/auth`)**
| Method | Endpoint | Description | Protection |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Register a new user and send verification OTP | Public |
| `PATCH` | `/verify` | Verify email address with OTP | Rate-Limited |
| `POST` | `/signin` | User login (Triggers 2FA if enabled) | Rate-Limited |
| `POST` | `/login-with-code` | Complete login via 2FA OTP | Public |
| `POST` | `/login-with-google` | Authenticate using Google ID Token | Public |
| `POST` | `/send-otp` | Resend verification/login OTP | Rate-Limited |
| `PATCH` | `/reset-pass` | Reset password using OTP | Rate-Limited & Idempotent |
| `POST` | `/refresh-token` | Obtain a new access token via HTTP-only cookie | Public |
| `POST` | `/enable-two-step` | Enable 2-step verification for user account | Guard |
| `POST` | `/logout` | Clear authentication cookies | Guard |
| `POST` | `/upload-profile-pic` | Upload or update user profile picture | Guard |

---

### 📩 **Messaging, Requests & Conversations (`/api/message`)**

#### **Anonymous Messages**
| Method | Endpoint | Description | Protection |
| :--- | :--- | :--- | :--- |
| `POST` | `/send-message` | Send an anonymous message to a user | Public |
| `POST` | `/send-message/public` | Send an authenticated message to a user | Guard |
| `GET` | `/get-user-messages` | Retrieve all incoming messages for logged-in user | Guard |

#### **Identity Requests**
| Method | Endpoint | Description | Protection |
| :--- | :--- | :--- | :--- |
| `POST` | `/requests` | Request to reveal identity of an anonymous sender | Guard (Receiver Only) |
| `GET` | `/requests` | View identity requests received from other users | Guard (Sender Only) |
| `PATCH` | `/requests/:requestId` | Accept or reject an identity reveal request | Guard (Sender Only) |

#### **Private Conversations**
| Method | Endpoint | Description | Protection |
| :--- | :--- | :--- | :--- |
| `GET` | `/conversations` | Retrieve all active unlocked conversations | Guard (Participants Only) |
| `POST` | `/conversations/:conversationId/messages` | Send a message inside an unlocked conversation | Guard (Participants Only) |
| `GET` | `/conversations/:conversationId/messages` | Retrieve message history of a conversation | Guard (Participants Only) |

---

## 🛡️ Error Handling

The system utilizes a centralized global error handler coupled with a custom operational error class (`AppError`). All validation, authorization, and rate-limit errors yield standardized JSON responses:

```json
{
  "status": "error",
  "message": "Error message description"
}
```

---
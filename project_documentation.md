# Secure Backend API & Messaging System

A robust, production-ready Node.js and Express backend application featuring advanced authentication flows, Redis caching, rate limiting, and a secure messaging system. Built with modular architecture, strict validation, and robust security practices.

---

## 🚀 Key Features

* **Advanced Authentication & Security:**
  * Local registration, sign-in, and password reset with email-based OTP verification.
  * **Two-Step Verification (2FA/OTP):** Secure second-factor authentication for logins managed via Redis cache.
  * **Google OAuth Integration:** Seamless sign-in with Google tokens.
  * **JWT-Based Token Management:** Short-lived Access Tokens (`15m`) and long-lived Refresh Tokens (`7d`) using HTTP-only cookies.
  * **Password Hashing:** Secure password encryption using `bcrypt`.
* **Performance & Scalability:**
  * **Redis Caching Middleware:** Speeds up frequent responses and reduces database load.
  * **Idempotency Middleware:** Prevents duplicate requests using custom idempotency keys.
* **Protection & Rate Limiting:**
  * **Rate Limiter:** Protects sensitive routes (like sign-in and OTP verification) from brute-force attacks.
  * **File Upload & Validation:** Secure media uploads using `multer` combined with strict MIME-type validation via magic numbers (`file-type`).
* **Messaging Module:** Send and receive secure messages between users with deep-populated sender information.

---

## 🛠️ Tech Stack

* **Runtime:** Node.js (ES Modules)
* **Framework:** Express.js
* **Database:** MongoDB & Mongoose (Compatible with MongoDB Atlas)
* **Caching & Store:** Redis (`ioredis`)
* **Validation:** Zod
* **Authentication:** JSON Web Tokens (`jsonwebtoken`), Google Auth Library
* **Email Service:** Nodemailer
* **Security & Utilities:** `bcrypt`, `express-rate-limit`, `cookie-parser`, `cors`, `multer`

---

## 📂 Project Architecture

```text
src/
├── app/
│   ├── auth/          # Authentication module (Controllers, Routes, Services, DTOs, Models)
│   ├── message/       # Messaging module
│   └── user/          # User management module
├── lib/               # Core configurations & middlewares (Cache, DB, Email, JWT, Security, Validation)
├── pkg/               # Reusable packages (Error handling, Logger, Media/Multer, Utils)
├── app.js             # Express app setup and middleware configuration
├── routes.js          # Central router definition
└── server.js          # Server entry point
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory of your project and configure the following variables:

```env
PORT = 3000
DATABASE_URL = "mongodb://your_connection_string_here"
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
Make sure you have the following installed on your local machine:
* [Node.js](https://nodejs.org/) (v18+ recommended)
* [MongoDB](https://www.mongodb.com/) (or a MongoDB Atlas Cluster)
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
   * For development (with auto-reload):
     ```bash
     npm run dev
     ```
   * For production:
     ```bash
     npm start
     ```

---

## 🔌 API Endpoints Overview

### **Auth Routes (`/api/auth`)**
* `POST /register` - Register a new user and send verification OTP.
* `PATCH /verify` - Verify user email with OTP.
* `POST /signin` - Sign in user (triggers 2FA if enabled).
* `POST /login-with-code` - Verify 2FA OTP code and complete login.
* `POST /login-with-google` - Authenticate via Google ID token.
* `POST /refresh-token` - Generate a new access token using the refresh token cookie.
* `POST /send-otp` - Resend OTP code.
* `PATCH /reset-pass` - Reset password (supports idempotency).
* `POST /enable-two-step` - Enable 2-step verification.
* `POST /logout` - Clear authentication cookies.
* `POST /upload-profile-pic` - Upload/Update profile picture (Guard protected).

### **Message Routes (`/api/message`)**
* `POST /send-message` - Send a message.
* `POST /send-message/public` - Send a public/protected message (Guard protected).
* `GET /get-user-messages` - Retrieve all incoming messages for the logged-in user (Guard protected).

---

## 🛡️ Error Handling

The application features a centralized global error handler coupled with a custom operational error class (`ApError`). All operational errors (validation errors, unauthorized requests, rate limit breaches) are caught gracefully and returned in a standard JSON structure:

```json
{
  "status": "error",
  "message": "Error description here"
}
```

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
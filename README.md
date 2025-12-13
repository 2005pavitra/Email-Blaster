# Student Email Blaster

A secure web application for students to send formal emails (complaints/requests) to HODs using their own Gmail accounts via OAuth 2.0. Includes an Admin Dashboard to track email statistics.

## 🚀 Features
- **Google OAuth 2.0**: Secure sign-in with Gmail.
- **Anti-Spam Protection**: Auto-generates unique Reference IDs for every email subject.
- **Email Logging**: Tracks sender, recipient, subject, and timestamp in MongoDB.
- **Admin Dashboard**: Password-protected view (`/admin`) to see live statistics and logs.
- **Monorepo Structure**: Separate Client (React) and Server (Node.js) folders.

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Google OAuth Provider.
- **Backend**: Node.js, Express, Googleapis (Gmail API).
- **Database**: MongoDB Atlas.

## 📦 Installation & Local Setup

### 1. Backend (Server)
```bash
cd server
npm install
# Create a .env file with:
# GOOGLE_CLIENT_ID=...
# GOOGLE_CLIENT_SECRET=...
# MONGO_URI=...
npm start
```

### 2. Frontend (Client)
```bash
cd client
npm install
npm run dev
```

## ☁️ Deployment
- **Frontend**: Deployed on Vercel.
- **Backend**: Deployed on Render.
- **Configuration**:
  - Client uses `VITE_API_URL` to connect to the backend.
  - Server allows CORS for the Vercel domain.

## 🔒 Security
- **Admin Password**: The admin panel is protected by a simple password authentication mechanism.
- **Scopes**: Application requests minimal necessary scopes (`gmail.send`, `userinfo.email`).

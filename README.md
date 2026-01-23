# URL Shortener Backend (MERN)

A scalable URL shortener backend built with Node.js, Express, and MongoDB.  
Authenticated users can create short URLs, track total clicks, and manage their links securely.

This project is designed as a learning-focused but production-style backend.

---

## Features

- User authentication (email & password)
- HTTP-only cookie based authentication
- Create short URLs (auto-generated or custom alias)
- Case-sensitive short codes
- Redirect short URLs with click tracking
- View all URLs created by a user
- Total URL count per user
- Delete URLs (owner-only authorization)
- Rate limiting to prevent abuse
- Centralized error handling

---

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (stored in HTTP-only cookies)
- express-rate-limit
- dotenv

---

## Project Structure

```
src/
├── controllers/
├── models/
├── routes/
├── middlewares/
├── utils/
├── app.js
└── server.js

```


Each layer has a single responsibility to keep the codebase maintainable and scalable.

---

## Authentication Flow

- Users log in using email and password
- On success, a JWT is stored in an HTTP-only cookie
- Protected routes use middleware to verify the token
- Guest users can view the homepage but must log in to create URLs

---


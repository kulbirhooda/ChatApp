# ChatApp 💬

A WhatsApp-like real-time chat application built to understand and implement
real-time communication, authentication, and message persistence.

This project focuses on **correct architecture and real-world patterns** rather
than just UI or basic CRUD operations.

---

## 🚀 Features

- User authentication using JWT
- One-to-one real-time messaging
- Conversation-based chat system
- Message persistence (messages do not disappear on refresh)
- Real-time delivery using Socket.IO
- Protected REST APIs
- WhatsApp-style UI layout
- Sidebar showing existing conversations
- Chat history auto-loads on login/refresh

---

## 🛠 Tech Stack

### Frontend
- React
- Vite
- Axios
- Socket.IO Client

### Backend
- Node.js
- Express
- Socket.IO
- JWT Authentication

### Database
- PostgreSQL (Neon)
- Prisma ORM

---

## 🧠 Architecture Overview

- **REST APIs** are used for:
  - Authentication
  - Fetching conversations
  - Fetching chat history

- **Socket.IO** is used for:
  - Real-time message delivery
  - User-based socket rooms

- **Conversation-based model**
  - Messages belong to a `DirectConversation`
  - Sidebar is driven by conversations, not users
  - Same approach used by WhatsApp Web

---

## 📂 Project Structure

```txt
ChatApp/
├── backend/
│   ├── http/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   ├── socket/
│   │   ├── middleware/
│   │   ├── handlers/
│   ├── prisma/
│   └── app.js
│
├── client/
│   ├── src/
│       ├── Pages/
│       ├── context/
│       ├── api/
│       └── lib/
│
└── README.md

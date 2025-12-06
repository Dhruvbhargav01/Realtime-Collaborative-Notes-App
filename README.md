# Realtime Collaborative Notes App

A full-stack MERN (MongoDB, Express, React, Node.js) application that allows multiple users to create, edit, and collaborate on notes in real-time. Changes are synced instantly using Socket.IO.

**Live Demo:** [Realtime Collaborative Notes App](https://realtime-collaborative-notes-app-frontend.onrender.com)

---

## Features

* Create, edit, and delete notes.
* Real-time collaboration with multiple users.
* Responsive frontend built with React and Vite.
* RESTful backend API using Express and MongoDB.
* Instant updates with Socket.IO.

---

## Tech Stack

* **Frontend:** React, Vite, Axios, Socket.IO client
* **Backend:** Node.js, Express, MongoDB, Mongoose, Socket.IO
* **Deployment:** Render (frontend & backend hosted separately)

---

## Project Structure

```
Realtime-Collaborative-Notes-App/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── socket/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
└── .gitignore
```

---

## Installation & Setup

1. **Clone the repository**

```bash
git clone https://github.com/Dhruvbhargav01/Realtime-Collaborative-Notes-App.git
cd Realtime-Collaborative-Notes-App
```

2. **Backend setup**

```bash
cd backend
npm install
cp .env.example .env  # configure MongoDB URI and other env variables
npm run dev           # start backend server
```

3. **Frontend setup**

```bash
cd ../frontend
npm install
cp .env.example .env  # configure API endpoint for backend
npm run dev           # start frontend server
```

---

## Deployment

* Backend: Deployed on Render
* Frontend: Deployed on Render ([Live Demo](https://realtime-collaborative-notes-app-frontend.onrender.com))
* Ensure backend CORS includes the frontend URL.

---

## Environment Variables

### Backend `.env`

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
FRONTEND_ORIGIN=https://realtime-collaborative-notes-app-frontend.onrender.com
```

### Frontend `.env`

```
VITE_API_URL=https://realtime-collaborative-notes-app-backend.onrender.com/api
```

---

## License

MIT License

---

## Author

Dhruv Bhargav
[GitHub](https://github.com/Dhruvbhargav01)

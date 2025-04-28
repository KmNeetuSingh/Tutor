# 📚 Tutor Connect App

A full-stack **Tutor Finder** application where students can find available tutors, search by subject, and request personalized tutoring sessions.  
Built with **React**, **Node.js**, **Express**, and **MongoDB**.

---

## ✨ Features

- 🔍 **Search Tutors** by name, email, or subjects.
- 📑 **Filter** by subject specialization.
- 🧑‍🏫 **Tutor Profiles** with ratings and subjects.
- 📦 **Tutor Request Form** to book a session.
- 🌗 **Light/Dark Mode** theme support.
- 📱 **Fully Responsive** design for mobile, tablet, and desktop.
- 🔒 **Authentication** (JWT based).
- 📊 **Admin Panel** (optional: manage tutors and students).

---

## 🏗️ Tech Stack

**Frontend**:
- React.js
- Tailwind CSS
- React Router
- Framer Motion (animations)
- Axios (API calls)
- React Hot Toast (notifications)

**Backend**:
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)

---

## 🚀 Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/tutor-connect-app.git
cd tutor-connect-app
```

### 2. Install Dependencies

#### Frontend:
```bash
cd client
npm install
```

#### Backend:
```bash
cd server
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the `server/` directory:

```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

> **Note:** If you are using frontend environment variables, create a `.env` inside `client/` too:
```bash
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Start the Development Servers

#### Backend (Server):
```bash
cd server
npm run dev
```

#### Frontend (React app):
```bash
cd client
npm run dev
```

Now, open your browser and go to:  
[http://localhost:5173](http://localhost:5173) (or the port Vite shows).

---

## 🛠️ Folder Structure

```
tutor-connect-app/
├── client/          # React Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   └── App.jsx
├── server/          # Node/Express Backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
└── README.md
```

---

## 🌟 Future Improvements

- Profile pictures upload.
- Tutor availability calendar integration.
- Payment gateway integration (Stripe/PayPal).
- Chat system between students and tutors.
- Admin Dashboard with full analytics.

---

## 🙌 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

# Course Platform

This is a moodle-like application for creating online courses that students can attend.

---

## ✨ Features

- **Course management**: Admins/Teachers can create, edit and delete courses
- **Course completion**: Students can enroll on courses to learn.
- **Authentication**: User sign-up, login, and session persistence.

---

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS, React Router
- **Backend**: Node.js, Express
- **Database**: MongoDB / Mongoose

---

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sami-turunen/course-platform.git
   cd course-platform
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add the following:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```

4. **Install backend dependencies and run the development server:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

5. **Start the frontend:**
   Open another terminal:
   ```bash
   npm run dev
   ```
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CoursePage from "./pages/CoursePage";
import LessonPage from "./pages/LessonPage";
import AddLesson from "./pages/AddLesson";
import Explore from "./pages/Explore";

// A small helper component to decide which view to show at "/"
const RootPath = () => {
  const { user } = useAuth();
  return user ? <Home /> : <Landing />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app">
          {/* We only show the Navbar if the user is logged in, 
              since Landing has its own simple nav */}
          <AuthConditionalNavbar />

          <main className="main-content">
            <Routes>
              <Route path="/" element={<RootPath />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/courses/:id" element={<CoursePage />} />
              <Route
                path="/courses/:courseId/topics/:topicId/lessons/:lessonId"
                element={<LessonPage />}
              />
              <Route
                path="/courses/:courseId/topics/:topicId/add-lesson"
                element={<AddLesson />}
              />
              <Route path="/courses" element={<Explore />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

// Helper to hide main Navbar on Landing page
const AuthConditionalNavbar = () => {
  const { user } = useAuth();
  if (!user) return null;
  return <Navbar />;
};

export default App;

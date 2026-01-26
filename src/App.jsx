import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CoursePage from "./pages/CoursePage";

function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<div className="app">
					<Navbar />
					<main className="main-content">
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/login" element={<Login />} />
							<Route path="/register" element={<Register />} />
							<Route path="/dashboard" element={<Dashboard />} />
							<Route path="/courses/:id" element={<CoursePage />} />
						</Routes>
					</main>
				</div>
			</AuthProvider>
		</BrowserRouter>
	);
}

export default App;

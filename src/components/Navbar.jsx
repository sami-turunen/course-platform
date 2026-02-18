import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
	const { user, logout } = useAuth();

	return (
		<nav className="navbar">
			<div className="navbar-brand">
				<Link to="/">Moodle</Link>
			</div>
			<div className="navbar-links">
				<Link to="/">Courses</Link>
				{user ? (
					<>
						<Link to="/dashboard">Dashboard</Link>
						<span className="user-name">
							{user.name} ({user.role})
						</span>
						<button onClick={logout} className="btn-logout">
							Logout
						</button>
					</>
				) : (
					<>
						<Link to="/login">Login</Link>
						<Link to="/register">Register</Link>
					</>
				)}
			</div>
		</nav>
	);
};

export default Navbar;

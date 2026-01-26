import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { register } = useAuth();
	const navigate = useNavigate();
	const [error, setError] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await register(name, email, password);
			navigate("/login");
		} catch (err) {
			setError(err.response?.data?.error || "Registration failed");
		}
	};

	return (
		<div className="auth-container">
			<form onSubmit={handleSubmit} className="auth-form">
				<h2>Register</h2>
				{error && <p className="error-msg">{error}</p>}
				<div className="form-group">
					<label>Name</label>
					<input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
				</div>
				<div className="form-group">
					<label>Email</label>
					<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
				</div>
				<div className="form-group">
					<label>Password</label>
					<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
				</div>

				<button type="submit" className="btn-primary">
					Register
				</button>
			</form>
		</div>
	);
};

export default Register;

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";

const Dashboard = () => {
	const { user } = useAuth();

	if (!user) return <div className="p-4 text-center">Please login</div>;
	if (user.role === "student") return <StudentDashboard user={user} />;
	if (user.role === "instructor") return <InstructorDashboard user={user} />;
	if (user.role === "admin") return <AdminDashboard user={user} />;

	return <div>Unknown Role</div>;
};

const StudentDashboard = ({ user }) => {
	const [myCourses, setMyCourses] = useState([]);

	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const res = await axios.get("/api/courses");
				const enrolled = res.data.filter((c) => c.studentsEnrolled.includes(user.id));
				setMyCourses(enrolled);
			} catch (err) {
				console.error(err);
			}
		};
		fetchCourses();
	}, [user]);

	return (
		<div className="dashboard-container">
			<h1>My Learning</h1>
			<div className="courses-grid">
				{myCourses.map((c) => (
					<div key={c._id} className="course-card">
						<h3>{c.title}</h3>
						<p className="flex-grow">{c.description}</p>
						<Link to={`/courses/${c._id}`} className="btn-primary mt-2 text-center">
							Go to Course
						</Link>
					</div>
				))}
				{myCourses.length === 0 && <p>You are not enrolled in any courses.</p>}
			</div>
		</div>
	);
};

const InstructorDashboard = ({ user }) => {
	const [myCourses, setMyCourses] = useState([]);
	const [showForm, setShowForm] = useState(false);
	const [newCourse, setNewCourse] = useState({ title: "", description: "", price: 0 });

	const fetchCourses = async () => {
		try {
			const res = await axios.get("/api/courses");
			const mine = res.data.filter((c) => c.instructor._id === user.id);
			setMyCourses(mine);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		fetchCourses();
	}, [user]);

	const handleCreate = async (e) => {
		e.preventDefault();
		try {
			await axios.post("/api/courses", newCourse);
			setShowForm(false);
			setNewCourse({ title: "", description: "", price: 0 });
			fetchCourses();
		} catch (err) {
			alert(err.response?.data?.error || "Failed");
		}
	};

	return (
		<div className="dashboard-container">
			<h1>Instructor Dashboard</h1>
			<button onClick={() => setShowForm(!showForm)} className="btn-primary mb-4">
				{showForm ? "Cancel" : "Create New Course"}
			</button>

			{showForm && (
				<form onSubmit={handleCreate} className="course-form card mb-4">
					<h3>Create Course</h3>
					<div className="form-group">
						<label>Title</label>
						<input
							value={newCourse.title}
							onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
							required
						/>
					</div>
					<div className="form-group">
						<label>Description</label>
						<textarea
							value={newCourse.description}
							onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
							required
						/>
					</div>
					<div className="form-group">
						<label>Price</label>
						<input
							type="number"
							value={newCourse.price}
							onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
						/>
					</div>
					<button type="submit" className="btn-success">
						Publish
					</button>
				</form>
			)}

			<h2>My Courses</h2>
			<div className="courses-grid">
				{myCourses.map((c) => (
					<div key={c._id} className="course-card">
						<h3>{c.title}</h3>
						<p>{c.studentsEnrolled.length} Students</p>
						<Link to={`/courses/${c._id}`} className="btn-secondary text-center">
							Manage
						</Link>
					</div>
				))}
			</div>
		</div>
	);
};

const AdminDashboard = () => {
	const [users, setUsers] = useState([]);
	const [courses, setCourses] = useState([]);
	const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "instructor" });
	const [showUserForm, setShowUserForm] = useState(false);

	// Course Creation State
	const [showCourseForm, setShowCourseForm] = useState(false);
	const [newCourse, setNewCourse] = useState({ title: "", description: "", price: 0 });

	const fetchData = async () => {
		try {
			const usersRes = await axios.get("/api/auth/users");
			setUsers(usersRes.data);
			const coursesRes = await axios.get("/api/courses");
			setCourses(coursesRes.data);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handleCreateUser = async (e) => {
		e.preventDefault();
		try {
			await axios.post("/api/auth/create-user", newUser);
			alert("User created");
			setNewUser({ name: "", email: "", password: "", role: "instructor" });
			setShowUserForm(false);
			fetchData();
		} catch (err) {
			alert(err.response?.data?.error || "Failed");
		}
	};

	const handleCreateCourse = async (e) => {
		e.preventDefault();
		try {
			await axios.post("/api/courses", newCourse);
			alert("Course created");
			setNewCourse({ title: "", description: "", price: 0 });
			setShowCourseForm(false);
			fetchData();
		} catch (err) {
			alert(err.response?.data?.error || "Failed");
		}
	};

	const deleteCourse = async (id) => {
		if (!confirm("Delete this course?")) return;
		try {
			await axios.delete(`/api/courses/${id}`);
			fetchData();
		} catch (err) {
			alert("Failed to delete", err);
		}
	};

	return (
		<div className="dashboard-container">
			<h1>Admin Panel</h1>

			<section className="mb-5">
				<div className="flex justify-between items-center mb-2">
					<h2>Users Management</h2>
					<button onClick={() => setShowUserForm(!showUserForm)} className="btn-primary">
						{showUserForm ? "Cancel" : "Add User"}
					</button>
				</div>

				{showUserForm && (
					<form onSubmit={handleCreateUser} className="card mb-4" style={{ maxWidth: "500px" }}>
						<h3>Create New User</h3>
						<div className="form-group">
							<label>Name</label>
							<input value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} required />
						</div>
						<div className="form-group">
							<label>Email</label>
							<input
								type="email"
								value={newUser.email}
								onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
								required
							/>
						</div>
						<div className="form-group">
							<label>Password</label>
							<input
								type="password"
								value={newUser.password}
								onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
								required
							/>
						</div>
						<div className="form-group">
							<label>Role</label>
							<select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
								<option value="student">Student</option>
								<option value="instructor">Instructor</option>
								<option value="admin">Admin</option>
							</select>
						</div>
						<button type="submit" className="btn-success">
							Create User
						</button>
					</form>
				)}

				<div className="card">
					<table style={{ width: "100%", borderCollapse: "collapse" }}>
						<thead>
							<tr style={{ textAlign: "left", borderBottom: "1px solid #eee" }}>
								<th className="p-2">Name</th>
								<th className="p-2">Email</th>
								<th className="p-2">Role</th>
							</tr>
						</thead>
						<tbody>
							{users.map((u) => (
								<tr key={u._id} style={{ borderBottom: "1px solid #f9f9f9" }}>
									<td className="p-2">{u.name}</td>
									<td className="p-2">{u.email}</td>
									<td className="p-2">
										<span
											style={{
												padding: "2px 6px",
												borderRadius: "4px",
												background: u.role === "admin" ? "#fde047" : "#e0f2fe",
												fontSize: "0.8rem"
											}}
										>
											{u.role}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<div className="flex justify-between items-center mb-2">
					<h2>All Courses</h2>
					<button onClick={() => setShowCourseForm(!showCourseForm)} className="btn-primary">
						{showCourseForm ? "Cancel" : "Create Course"}
					</button>
				</div>

				{showCourseForm && (
					<form onSubmit={handleCreateCourse} className="course-form card mb-4">
						<h3>Create New Course</h3>
						<div className="form-group">
							<label>Title</label>
							<input
								value={newCourse.title}
								onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
								required
							/>
						</div>
						<div className="form-group">
							<label>Description</label>
							<textarea
								value={newCourse.description}
								onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
								required
							/>
						</div>
						<div className="form-group">
							<label>Price</label>
							<input
								type="number"
								value={newCourse.price}
								onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
							/>
						</div>
						<button type="submit" className="btn-success">
							Publish
						</button>
					</form>
				)}

				<div className="courses-grid">
					{courses.map((c) => (
						<div key={c._id} className="course-card">
							<h3>{c.title}</h3>
							<p>By {c.instructor?.name || "Unknown"}</p>
							<div className="actions mt-2" style={{ display: "flex", gap: "0.5rem" }}>
								<Link to={`/courses/${c._id}`} className="btn-secondary">
									View
								</Link>
								<button onClick={() => deleteCourse(c._id)} className="btn-logout" style={{ padding: "0.5rem" }}>
									Delete
								</button>
							</div>
						</div>
					))}
				</div>
			</section>
		</div>
	);
};

export default Dashboard;

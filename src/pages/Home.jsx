import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Home = () => {
	const [courses, setCourses] = useState([]);
	const { user } = useAuth();

	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const res = await axios.get("/api/courses");
				setCourses(res.data);
			} catch (err) {
				console.error(err);
			}
		};
		fetchCourses();
	}, []);

	const handleEnroll = async (courseId) => {
		try {
			await axios.post(`/api/courses/${courseId}/enroll`);
			alert("Enrolled successfully!");
			// Refresh courses
			const res = await axios.get("/api/courses");
			setCourses(res.data);
		} catch (err) {
			alert(err.response?.data?.message || "Enrollment failed");
		}
	};

	return (
		<div className="home-container">
			<header className="hero">
				<h1>Welcome to MoodleClone</h1>
				<p>Start learning today.</p>
			</header>
			<div className="courses-grid">
				{courses.map((course) => (
					<div key={course._id} className="course-card">
						{course.thumbnail && <img src={course.thumbnail} alt={course.title} />}
						<h3>{course.title}</h3>
						<p>{course.description}</p>
						<p>
							<strong>Instructor:</strong> {course.instructor.name}
						</p>
						<p>
							<strong>Price:</strong> ${course.price}
						</p>
						{user && user.role === "student" && (
							<button
								onClick={() => handleEnroll(course._id)}
								disabled={course.studentsEnrolled.includes(user.id)}
								className="btn-primary"
							>
								{course.studentsEnrolled.includes(user.id) ? "Enrolled" : "Enroll Now"}
							</button>
						)}
						{!user && (
							<Link to="/login" className="btn-secondary">
								Login to Enroll
							</Link>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default Home;

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";

const port = 3001;

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return <div>Please login</div>;
  if (user.role === "student") return <StudentDashboard user={user} />;
  if (user.role === "instructor") return <InstructorDashboard user={user} />;
  if (user.role === "admin") return <AdminDashboard />;

  return <div>Unknown Role</div>;
};

const StudentDashboard = ({ user }) => {
  const [myCourses, setMyCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("/api/courses");
        const enrolled = res.data.filter((c) =>
          c.studentsEnrolled.includes(user.id),
        );
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
            <p>{c.description}</p>
            <Link to={`/courses/${c._id}`}>Go to Course</Link>
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
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
  });

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`http://localhost:${port}/api/courses`);
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
      setNewCourse({ title: "", description: "" });
      fetchCourses();
    } catch (err) {
      alert(err.response?.data?.error || "Failed");
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Instructor Dashboard</h1>

      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "Create New Course"}
      </button>

      {showForm && (
        <form onSubmit={handleCreate} className="course-form">
          <h3>Create Course</h3>

          <div>
            <label>Title</label>
            <input
              value={newCourse.title}
              onChange={(e) =>
                setNewCourse({ ...newCourse, title: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label>Description</label>
            <textarea
              value={newCourse.description}
              onChange={(e) =>
                setNewCourse({ ...newCourse, description: e.target.value })
              }
              required
            />
          </div>

          <button type="submit">Publish</button>
        </form>
      )}

      <h2>My Courses</h2>

      <div className="courses-grid">
        {myCourses.map((c) => (
          <div key={c._id} className="course-card">
            <h3>{c.title}</h3>
            <p>{c.studentsEnrolled.length} Students</p>
            <Link to={`/courses/${c._id}`}>Manage</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "instructor",
  });
  const [showUserForm, setShowUserForm] = useState(false);

  const [showCourseForm, setShowCourseForm] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
  });

  const fetchData = async () => {
    try {
      const usersRes = await axios.get(
        `http://localhost:${port}/api/auth/users`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setUsers(usersRes.data);
      console.log(usersRes.data);
      const coursesRes = await axios.get(
        `http://localhost:${port}/api/courses`,
      );
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
      setNewCourse({ title: "", description: "" });
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
      alert("Failed to delete");
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Admin Panel</h1>

      <section>
        <h2>Users Management</h2>
        <button
          onClick={() => setShowUserForm(!showUserForm)}
          className="btn-primary"
        >
          {showUserForm ? "Cancel" : "Add User"}
        </button>

        {showUserForm && (
          <form onSubmit={handleCreateUser} className="form-group">
            <h3>Create New User</h3>

            <div>
              <label>Name</label>
              <input
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label>Email</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label>Password</label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label>Role</label>
              <select
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button className="btn-primary create-user" type="submit">
              Create User
            </button>
          </form>
        )}

        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td data-label="Name">{u.name}</td>
                <td data-label="Email">{u.email}</td>
                <td data-label="Role">
                  <span className={`role-badge ${u.role}`}>{u.role}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>All Courses</h2>
        <button
          onClick={() => setShowCourseForm(!showCourseForm)}
          className="btn-primary"
        >
          {showCourseForm ? "Cancel" : "Create Course"}
        </button>

        {showCourseForm && (
          <form onSubmit={handleCreateCourse} className="form-group">
            <h3>Create New Course</h3>

            <div>
              <label>Title</label>
              <input
                value={newCourse.title}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, title: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label>Description</label>
              <textarea
                value={newCourse.description}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, description: e.target.value })
                }
                required
              />
            </div>

            <button
              className="btn-primary"
              type="submit"
              style={{ marginTop: "10px" }}
            >
              Publish
            </button>
          </form>
        )}

        <div className="courses-grid">
          {courses.map((c) => (
            <div key={c._id} className="course-card">
              <h3>{c.title}</h3>
              <p>By {c.instructor?.name || "Unknown"}</p>
              <Link
                className="btn-primary"
                style={{
                  marginBottom: "10px",
                  width: "50%",
                  textAlign: "center",
                }}
                to={`/courses/${c._id}`}
              >
                View
              </Link>
              <button
                className="btn-danger"
                style={{ width: "50%" }}
                onClick={() => deleteCourse(c._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

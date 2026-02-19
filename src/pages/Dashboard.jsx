import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen text-xl font-semibold">
        Please login to access the dashboard.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {user.role === "student" && <StudentDashboard user={user} />}
        {user.role === "instructor" && <InstructorDashboard user={user} />}
        {user.role === "admin" && <AdminDashboard />}
      </div>
    </div>
  );
};

/* Student */
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
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        My Learning Path
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myCourses.map((c) => (
          <div
            key={c._id}
            className="bg-white rounded-xl shadow-sm border p-6 flex flex-col"
          >
            <h3 className="text-xl font-bold mb-2">{c.title}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {c.description}
            </p>
            <Link
              to={`/courses/${c._id}`}
              className="mt-auto inline-block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Continue Learning
            </Link>
          </div>
        ))}
      </div>
      {myCourses.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500">
            You haven't enrolled in any courses yet.
          </p>
          <Link
            to="/"
            className="text-blue-600 font-semibold hover:underline mt-2 inline-block"
          >
            Browse Catalog
          </Link>
        </div>
      )}
    </div>
  );
};

/* Instructor */
const InstructorDashboard = ({ user }) => {
  const [myCourses, setMyCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: "", description: "" });

  const fetchCourses = async () => {
    const res = await axios.get("/api/courses");
    setMyCourses(res.data.filter((c) => c.instructor?._id === user.id));
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
      alert("Failed to create course");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Instructor Console</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`px-4 py-2 rounded-lg font-semibold text-white transition ${showForm ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {showForm ? "Cancel" : "+ New Course"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-white p-6 rounded-xl shadow-md border mb-8 space-y-4"
        >
          <h2 className="text-xl font-bold">Create New Course</h2>
          <input
            className="w-full border p-2 rounded"
            placeholder="Course Title"
            value={newCourse.title}
            onChange={(e) =>
              setNewCourse({ ...newCourse, title: e.target.value })
            }
            required
          />
          <textarea
            className="w-full border p-2 rounded"
            rows="3"
            placeholder="Description"
            value={newCourse.description}
            onChange={(e) =>
              setNewCourse({ ...newCourse, description: e.target.value })
            }
            required
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Publish Course
          </button>
        </form>
      )}

      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        My Active Courses
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myCourses.map((c) => (
          <div key={c._id} className="bg-white border rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-1">{c.title}</h3>
            <p className="text-blue-600 text-sm font-medium mb-4">
              {c.studentsEnrolled.length} Students Enrolled
            </p>
            <Link
              to={`/courses/${c._id}`}
              className="block text-center border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition"
            >
              Manage Course
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

/* Admin Dashboard*/
const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "instructor",
  });
  const [showForm, setShowForm] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: "", description: "" });

  const fetchData = async () => {
    try {
      const uRes = await axios.get("/api/auth/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const cRes = await axios.get("/api/courses");
      setUsers(uRes.data);
      setCourses(cRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-12">
      <header className="border-b pb-4">
        <h1 className="text-4xl font-extrabold text-gray-900">Admin Panel</h1>
      </header>

      {/* User List */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">User Directory</h2>
          <button
            onClick={() => setShowUserForm(!showUserForm)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            {showUserForm ? "Close Form" : "Add New User"}
          </button>
        </div>

        {showUserForm && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await axios.post("/api/auth/create-user", newUser);
              setShowUserForm(false);
              fetchData();
            }}
            className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              placeholder="Name"
              className="p-2 border rounded"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <input
              placeholder="Email"
              type="email"
              className="p-2 border rounded"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />
            <input
              placeholder="Password"
              type="password"
              className="p-2 border rounded"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
            />
            <select
              className="p-2 border rounded"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
              <option value="admin">Admin</option>
            </select>
            <button className="md:col-span-2 bg-indigo-600 text-white py-2 rounded font-bold">
              Create User Account
            </button>
          </form>
        )}

        <div className="bg-white shadow-md rounded-xl overflow-hidden border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {u.name}
                    </div>
                    <div className="text-sm text-gray-500">{u.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${
                        u.role === "admin"
                          ? "bg-red-100 text-red-700"
                          : u.role === "instructor"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                      }`}
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

      {/* Course List */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Course Management
        </h2>
        {/* New course creation */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          {showForm ? "Close Form" : "Add New Course"}
        </button>

        {showForm && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await axios.post("/api/courses", {
                title: newCourse.title,
                description: newCourse.description,
              });
              setShowForm(false);
              fetchData();
            }}
            className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              placeholder="Course Title"
              className="p-2 border rounded"
              value={newCourse.title}
              onChange={(e) => {
                setNewCourse({ ...newCourse, title: e.target.value });
              }}
            />
            <input
              placeholder="Course Description"
              className="p-2 border rounded"
              value={newCourse.description}
              onChange={(e) => {
                setNewCourse({ ...newCourse, description: e.target.value });
              }}
            />
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
              Create Course
            </button>
          </form>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((c) => (
            <div
              key={c._id}
              className="bg-white border rounded-xl p-5 hover:border-red-200 transition group"
            >
              <h3 className="font-bold text-lg">{c.title}</h3>
              <p className="text-sm text-gray-500 mb-4">
                By {c.instructor?.name || "Unknown"}
              </p>
              <div className="flex gap-2">
                <Link
                  to={`/courses/${c._id}`}
                  className="flex-1 bg-gray-100 text-center py-2 rounded-lg text-sm font-semibold hover:bg-gray-200"
                >
                  View
                </Link>
                <button
                  onClick={async () => {
                    if (confirm("Delete?")) {
                      await axios.delete(`/api/courses/${c._id}`);
                      fetchData();
                    }
                  }}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition"
                >
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

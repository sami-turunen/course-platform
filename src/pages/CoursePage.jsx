import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const CoursePage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  // Topic UI State
  const [isAddingTopic, setIsAddingTopic] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState("");

  const fetchCourse = async () => {
    try {
      const res = await axios.get(`/api/courses/${id}`);
      setCourse(res.data);
      setEditData({ title: res.data.title, description: res.data.description });
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  // Handlers

  const handleEnroll = async () => {
    try {
      await axios.post(`/api/courses/${id}/enroll`);
      alert("Enrolled successfully!");
      fetchCourse(); // Refresh data
    } catch (err) {
      alert(err.response?.data?.error || "Enrollment failed");
    }
  };

  const handleUpdateCourse = async () => {
    try {
      const res = await axios.put(`/api/courses/${id}`, editData);
      setCourse(res.data);
      setIsEditing(false);
    } catch (err) {
      alert("Update failed");
    }
  };

  const handleAddTopic = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/courses/${id}/topics`, { title: newTopicTitle });
      setNewTopicTitle("");
      setIsAddingTopic(false);
      fetchCourse();
    } catch (err) {
      alert("Failed to add topic");
    }
  };

  const isInstructor =
    user && (user.id === course?.instructor?._id || user.role === "admin");
  const isEnrolled =
    user && (course?.studentsEnrolled?.includes(user.id) || isInstructor);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen italic text-gray-500">
        Loading Course...
      </div>
    );
  if (!course)
    return (
      <div className="p-8 text-center text-red-500 font-bold">
        Course not found
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex-1">
            {!isEditing ? (
              <>
                <h1 className="text-4xl font-extrabold tracking-tight mb-2">
                  {course.title}
                </h1>
                <div className="flex items-center gap-4 text-slate-300 mb-4 text-sm">
                  <span>
                    Created by{" "}
                    <span className="text-white font-medium">
                      {course.instructor?.name}
                    </span>
                  </span>
                  <span>•</span>
                  <span>{course.studentsEnrolled?.length || 0} Students</span>
                </div>
              </>
            ) : (
              <input
                className="w-full bg-slate-800 border border-slate-700 p-3 rounded text-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500"
                value={editData.title}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
              />
            )}
          </div>

          <div className="flex gap-3">
            {isInstructor && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-white text-slate-900 px-5 py-2 rounded-lg font-bold hover:bg-gray-100 transition"
              >
                Edit Course
              </button>
            )}
            {!isEnrolled && user && (
              <button
                onClick={handleEnroll}
                className="bg-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg"
              >
                Enroll Now
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8 mt-[-40px]">
        <div className="lg:col-span-2 space-y-6">
          {/* About Section */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-slate-800">
              About this course
            </h2>
            {!isEditing ? (
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {course.description}
              </p>
            ) : (
              <div className="space-y-4">
                <textarea
                  className="w-full p-4 border rounded-lg h-40 outline-none focus:ring-2 focus:ring-blue-500"
                  value={editData.description}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdateCourse}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-100 px-6 py-2 rounded-lg hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Curriculum Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-slate-800">
                Course Curriculum
              </h2>
              {isInstructor && (
                <button
                  onClick={() => setIsAddingTopic(true)}
                  className="text-blue-600 font-bold hover:underline text-sm"
                >
                  + Add Topic
                </button>
              )}
            </div>

            {/* Topic form */}
            {isAddingTopic && (
              <form
                onSubmit={handleAddTopic}
                className="p-6 bg-blue-50 border-b flex gap-2"
              >
                <input
                  autoFocus
                  className="flex-1 p-2 border rounded outline-none"
                  placeholder="Topic Title (e.g. Introduction)"
                  value={newTopicTitle}
                  onChange={(e) => setNewTopicTitle(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded font-bold"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingTopic(false)}
                  className="text-gray-500 px-2"
                >
                  Cancel
                </button>
              </form>
            )}

            <div className="divide-y divide-gray-100">
              {course.topics.map((topic) => (
                <div key={topic._id} className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-slate-800">
                      {topic.title}
                    </h3>
                    {isInstructor && (
                      <Link
                        to={`/courses/${id}/topics/${topic._id}/add-lesson`}
                        className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full hover:bg-slate-200 transition"
                      >
                        + Add Lesson
                      </Link>
                    )}
                  </div>

                  <div className="space-y-2">
                    {topic.lessons.length > 0 ? (
                      topic.lessons
                        .filter((l) => isInstructor || !l.hidden)
                        .map((lesson) => (
                          <Link
                            key={lesson._id}
                            to={
                              isEnrolled
                                ? `/courses/${id}/topics/${topic._id}/lessons/${lesson._id}`
                                : "#"
                            }
                            className={`flex items-center justify-between p-3 rounded-lg border transition group ${isEnrolled ? "hover:border-blue-200 hover:bg-blue-50/30" : "cursor-not-allowed opacity-60"}`}
                            onClick={(e) => !isEnrolled && e.preventDefault()}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-gray-400 group-hover:text-blue-500">
                                {lesson.type === "quiz" ? "📝" : "📄"}
                              </span>
                              <span className="font-medium text-slate-700">
                                {lesson.title}
                              </span>
                            </div>
                            {!isEnrolled && (
                              <span className="text-xs text-gray-400 font-bold">
                                LOCKED
                              </span>
                            )}
                          </Link>
                        ))
                    ) : (
                      <p className="text-sm text-gray-400 italic">
                        No lessons in this topic yet.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-6">
            <h3 className="font-bold text-lg mb-4 text-slate-800">
              Course Summary
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span
                  className={`font-bold ${isEnrolled ? "text-green-600" : "text-blue-600"}`}
                >
                  {isEnrolled ? "✓ Enrolled" : "Not Enrolled"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Modules</span>
                <span className="font-bold">{course.topics.length}</span>
              </div>
            </div>
            {!isEnrolled && (
              <button
                onClick={handleEnroll}
                className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition active:scale-95"
              >
                Enroll in Course
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;

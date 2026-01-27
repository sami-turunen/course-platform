import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

  // Topic State
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [isAddingTopic, setIsAddingTopic] = useState(false);

  // Lesson State
  const [activeTopicId, setActiveTopicId] = useState(null);
  const [newLesson, setNewLesson] = useState({
    title: "",
    type: "text",
    content: "",
  });

  const fetchCourse = async () => {
    try {
      const res = await axios.get(`/api/courses/${id}`);
      setCourse(res.data);
      setEditData(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 404) alert("Course not found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/api/courses/${id}`, editData);
      setCourse(res.data);
      setIsEditing(false);
      alert("Course updated!");
    } catch (err) {
      alert(err.response?.data?.error || "Update failed");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      await axios.delete(`/api/courses/${id}`);
      alert("Course deleted");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.error || "Delete failed");
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

  const handleAddLesson = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `/api/courses/${id}/topics/${activeTopicId}/lessons`,
        newLesson,
      );
      setNewLesson({ title: "", type: "text", content: "" });
      setActiveTopicId(null);
      fetchCourse();
    } catch (err) {
      alert("Failed to add lesson");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!course) return <div>Course not found</div>;

  const isInstructor =
    user && (user.id === course.instructor._id || user.role === "admin");
  const isEnrolled =
    user && (course.studentsEnrolled.includes(user.id) || isInstructor);

  return (
    <div className="course-page">
      <div className="card">
        {!isEditing ? (
          <>
            <h1>{course.title}</h1>
            <p className="instructor">Instructor: {course.instructor.name}</p>
            <div className="description">{course.description}</div>
            <p className="price">Price: ${course.price}</p>

            {isInstructor && (
              <div className="actions">
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-secondary"
                >
                  Edit Details
                </button>
                <button onClick={handleDelete} className="btn-logout">
                  Delete Course
                </button>
              </div>
            )}
          </>
        ) : (
          <form onSubmit={handleUpdate}>
            <h2>Edit Course</h2>
            <div className="form-group">
              <label>Title</label>
              <input
                value={editData.title}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                rows="5"
              />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                value={editData.price}
                onChange={(e) =>
                  setEditData({ ...editData, price: e.target.value })
                }
              />
            </div>
            <button type="submit" className="btn-success">
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </form>
        )}
      </div>

      <div className="course-content">
        <div>
          <h2>Course Content</h2>
          {isInstructor && (
            <button
              onClick={() => setIsAddingTopic(true)}
              className="btn-primary"
            >
              Add Topic
            </button>
          )}
        </div>

        {isAddingTopic && (
          <div className="card">
            <form onSubmit={handleAddTopic} className="flex gap-2 items-center">
              <input
                placeholder="Topic Title"
                value={newTopicTitle}
                onChange={(e) => setNewTopicTitle(e.target.value)}
                required
              />
              <button type="submit" className="btn-success">
                Add
              </button>
              <button
                type="button"
                onClick={() => setIsAddingTopic(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        {!isEnrolled ? (
          <div>
            <p>Please enroll to access course content.</p>
          </div>
        ) : (
          <div className="topics-list">
            {course.topics &&
              course.topics.map((topic) => (
                <div key={topic._id} className="topic-item card">
                  <div className="topic-header">
                    <h3>{topic.title}</h3>
                    {isInstructor && (
                      <button
                        onClick={() =>
                          setActiveTopicId(
                            activeTopicId === topic._id ? null : topic._id,
                          )
                        }
                      >
                        {activeTopicId === topic._id
                          ? "Cancel Lesson"
                          : "Add Lesson"}
                      </button>
                    )}
                  </div>

                  {activeTopicId === topic._id && (
                    <div className="add-lesson-form">
                      <h4>Add Lesson to {topic.title}</h4>
                      <form onSubmit={handleAddLesson}>
                        <div className="form-group">
                          <input
                            placeholder="Lesson Title"
                            value={newLesson.title}
                            onChange={(e) =>
                              setNewLesson({
                                ...newLesson,
                                title: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="form-group">
                          <select
                            value={newLesson.type}
                            onChange={(e) =>
                              setNewLesson({
                                ...newLesson,
                                type: e.target.value,
                              })
                            }
                          >
                            <option value="text">Text</option>
                            <option value="video">Video URL</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <textarea
                            placeholder="Content or URL"
                            value={newLesson.content}
                            onChange={(e) =>
                              setNewLesson({
                                ...newLesson,
                                content: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <button type="submit" className="btn-success">
                          Save Lesson
                        </button>
                      </form>
                    </div>
                  )}

                  <div className="lessons-list">
                    {topic.lessons.length === 0 && <p>No lessons yet.</p>}
                    {topic.lessons.map((lesson) => (
                      <div key={lesson._id} className="lesson-item">
                        <div>
                          <span>{lesson.type}</span>
                          <span>{lesson.title}</span>
                        </div>
                        <button>View</button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursePage;

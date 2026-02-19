import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import TextEditor from "../components/TextEditor";

const AddLesson = () => {
  const { courseId, topicId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    type: "text", // default
    content: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `/api/courses/${courseId}/topics/${topicId}/lessons`,
        formData,
      );
      alert("Lesson added successfully!");
      navigate(`/courses/${courseId}`);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add lesson");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-8 border-b bg-gray-50/50">
          <Link
            to={`/courses/${courseId}`}
            className="text-sm text-blue-600 font-medium"
          >
            ← Back to Course
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 mt-4">
            Create New Lesson
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Lesson Title
            </label>
            <input
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="e.g. Introduction to React Hooks"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          {/* Type Selector */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Lesson Type
            </label>
            <select
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
            >
              <option value="text">Text Document</option>
              <option value="video">YouTube Video</option>
            </select>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {formData.type === "video"
                ? "YouTube URL"
                : "Lesson Content (Markdown/Text)"}
            </label>
            {formData.type === "video" ? (
              <input
                required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="https://www.youtube.com/watch?v=..."
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
              />
            ) : (
              <TextEditor
                value={formData.content}
                onChange={(html) => setFormData({ ...formData, content: html })}
              />
            )}
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
            >
              Create Lesson
            </button>
            <button
              type="button"
              onClick={() => navigate(`/courses/${courseId}`)}
              className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLesson;

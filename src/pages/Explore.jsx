import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Explore = () => {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <div className="max-w-7xl mx-auto px-6 pt-16">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
            Browse Courses
          </h1>
          <p className="text-slate-500 mt-2">
            Find a topic that interests you and start learning.
          </p>

          {/*Search */}
          <div className="mt-8 max-w-md">
            <input
              type="text"
              placeholder="Search by title..."
              className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredCourses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col hover:shadow-xl transition-all group"
            >
              <div className="aspect-video bg-slate-100 flex items-center justify-center text-3xl group-hover:bg-slate-200 transition-colors">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  "📖"
                )}
              </div>
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {course.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-6">
                  {course.description}
                </p>
                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {course.studentsEnrolled.length} Students
                  </span>
                  <Link
                    to={`/courses/${course._id}`}
                    className="px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-blue-600 transition shadow-md"
                  >
                    View Course
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-slate-400">
              No courses found matching "{searchQuery}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;

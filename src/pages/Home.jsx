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

  const enrolledCourses = courses.filter((c) =>
    c.studentsEnrolled.includes(user?.id),
  );
  const otherCourses = courses.filter(
    (c) => !c.studentsEnrolled.includes(user?.id),
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <div className="max-w-6xl mx-auto px-6 pt-12">
        {/* Welcome Header */}
        <header className="mb-12">
          <h1 className="text-3xl font-bold text-slate-900">
            Hey, {user?.name.split(" ")[0]} 👋
          </h1>
          <p className="text-slate-500 mt-1">
            Ready to pick up where you left off?
          </p>
        </header>

        {/* My Courses Section */}
        {enrolledCourses.length > 0 && (
          <section className="mb-16">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6">
              Your Courses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrolledCourses.map((course) => (
                <Link
                  key={course._id}
                  to={`/courses/${course._id}`}
                  className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center gap-6 hover:shadow-lg hover:border-blue-200 transition group"
                >
                  <div className="w-20 h-20 bg-blue-50 rounded-xl flex items-center justify-center text-3xl shrink-0">
                    📚
                  </div>
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-blue-600">
                      {course.title}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-1 mt-1">
                      {course.description}
                    </p>
                    <span className="inline-block mt-3 text-xs font-bold text-blue-600">
                      Continue Lessons →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Explore More Section */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6">
            Explore Other Topics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition"
              >
                <div className="aspect-video bg-slate-100 flex items-center justify-center text-2xl">
                  📖
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-slate-900 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-6">
                    {course.description}
                  </p>
                  <Link
                    to={`/courses/${course._id}`}
                    className="block text-center py-2 bg-slate-900 text-white rounded-lg text-sm font-bold"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;

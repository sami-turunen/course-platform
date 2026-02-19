import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Landing = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get("/api/courses");
        // Showcase the first 3 courses as a preview
        setFeaturedCourses(res.data.slice(0, 3));
      } catch (err) {
        console.error("Could not load featured courses", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-mist-500 selection:text-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="text-xl font-bold tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs">
            MD
          </div>
          Moodle
        </div>
        <div className="hidden md:flex space-x-8 items-center">
          <Link
            to="/courses"
            className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition"
          >
            Browse Content
          </Link>
          <Link
            to="/login"
            className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-200"
          >
            Create Account
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto pt-20 pb-32 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="text-left">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-[1.05] text-slate-900">
              Clear lessons for <br />
              <span className="text-blue-600">practical skills.</span>
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed mb-10 max-w-lg">
              A straightforward collection of courses designed to help you learn
              at your own pace. No complex systems, just structured content to
              help you get things done.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/register"
                className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
              >
                Get Started for Free
              </Link>
              <Link
                to="/courses"
                className="px-8 py-4 bg-white text-slate-600 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all"
              >
                Explore Courses
              </Link>
            </div>
          </div>

          {/* Decorative Preview UI */}
          <div className="relative hidden lg:block">
            <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 shadow-inner">
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  </div>
                  <div className="h-2 w-24 bg-slate-100 rounded-full"></div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="h-4 w-1/3 bg-blue-100 rounded"></div>
                    <div className="h-8 w-full bg-slate-50 rounded-lg"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-32 bg-slate-50 rounded-2xl border border-dashed border-slate-200"></div>
                    <div className="h-32 bg-slate-50 rounded-2xl border border-dashed border-slate-200"></div>
                  </div>
                  <div className="h-12 w-full bg-slate-900 rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="bg-slate-50 py-24 px-6 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Start with the basics.
              </h2>
              <p className="text-slate-500 leading-relaxed">
                Browse our most popular learning paths. Each course is broken
                down into manageable topics with clear examples.
              </p>
            </div>
            <Link
              to="/courses"
              className="text-blue-600 font-bold hover:text-blue-700 flex items-center gap-2"
            >
              View all courses <span className="text-xl">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {loading
              ? [1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[16/10] bg-slate-200 rounded-2xl mb-6"></div>
                    <div className="h-6 w-2/3 bg-slate-200 rounded mb-2"></div>
                    <div className="h-4 w-full bg-slate-100 rounded"></div>
                  </div>
                ))
              : featuredCourses.map((course) => (
                  <div key={course._id} className="group cursor-pointer">
                    <div className="aspect-[16/10] bg-white rounded-2xl mb-6 overflow-hidden border border-slate-200 shadow-sm group-hover:shadow-md transition-shadow">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl bg-slate-100">
                          📖
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-2 mb-4 leading-relaxed">
                      {course.description}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                        Self-Paced
                      </span>
                      <div className="h-px flex-1 bg-slate-200"></div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto py-32 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="space-y-4">
            <div className="text-2xl">📁</div>
            <h3 className="text-xl font-bold italic">No Distractions</h3>
            <p className="text-slate-500 leading-relaxed text-sm">
              We focus on the content. No ads, no popups, and no "engagement
              hacks." Just the material you need to learn.
            </p>
          </div>
          <div className="space-y-4">
            <div className="text-2xl">🛠️</div>
            <h3 className="text-xl font-bold italic">Practical Examples</h3>
            <p className="text-slate-500 leading-relaxed text-sm">
              Every topic includes code snippets or real-world scenarios to help
              the concepts stick.
            </p>
          </div>
          <div className="space-y-4">
            <div className="text-2xl">📈</div>
            <h3 className="text-xl font-bold italic">Keep Momentum</h3>
            <p className="text-slate-500 leading-relaxed text-sm">
              Tracked progress helps you see how far you've come and makes it
              easy to pick up where you left off.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto pb-32 px-6">
        <div className="bg-slate-900 rounded-[3rem] py-20 px-10 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-6 tracking-tight">
              Ready to start learning?
            </h2>
            <p className="text-slate-400 mb-10 max-w-md mx-auto">
              Join the community to save your progress and access all materials.
            </p>
            <Link
              to="/register"
              className="inline-block px-10 py-5 bg-white text-slate-900 font-bold rounded-2xl hover:bg-slate-100 transition-all shadow-xl"
            >
              Create Your Free Account
            </Link>
          </div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-full bg-blue-500/10 blur-[120px]"></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto py-12 px-8 border-t border-slate-100 text-center md:text-left">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <div className="font-bold text-slate-900 mb-2">Moodle</div>
            <p className="text-xs text-slate-400">
              © 2026 Built for simple, effective education.
            </p>
          </div>
          <div className="flex gap-8 text-xs font-bold text-slate-500 uppercase tracking-widest">
            <Link to="/courses" className="hover:text-blue-600">
              All Courses
            </Link>
            <Link to="/login" className="hover:text-blue-600">
              Sign In
            </Link>
            <Link to="/register" className="hover:text-blue-600">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

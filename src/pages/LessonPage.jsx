import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const LessonPage = () => {
  const { courseId, topicId, lessonId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await axios.get(
          `/api/courses/${courseId}/topics/${topicId}/lessons/${lessonId}`,
        );
        const data = res.data;

        const isStaff = user?.role === "admin" || user?.role === "instructor";
        if (data.hidden && !isStaff) {
          setError("This lesson is currently hidden by the instructor.");
          return;
        }

        setLesson(data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load lesson");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchLesson();
  }, [courseId, topicId, lessonId, user]);

  const handleQuizSubmit = () => {
    let correctCount = 0;
    lesson.questions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctAnswerIndex) correctCount++;
    });
    setScore(correctCount);
    setQuizSubmitted(true);
  };

  const toggleHidden = async () => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/topics/${topicId}/lessons/${lessonId}`,
        { hidden: !lesson.hidden },
      );
      navigate(`/courses/${courseId}`);
    } catch (err) {
      alert("Failed to update visibility");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Loading lesson content...
      </div>
    );
  if (error)
    return (
      <div className="max-w-2xl mx-auto mt-20 p-6 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center font-bold">
        {error}
      </div>
    );

  const isStaff = user?.role === "admin" || user?.role === "instructor";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b sticky top-0 z-10 px-4 py-3">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link
            to={`/courses/${courseId}`}
            className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition"
          >
            <span className="mr-2">←</span> Back to Course Curriculum
          </Link>

          {isStaff && (
            <div className="flex gap-2">
              <button
                onClick={toggleHidden}
                className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider text-white transition ${lesson.hidden ? "bg-emerald-600 hover:bg-emerald-700" : "bg-amber-600 hover:bg-amber-700"}`}
              >
                {lesson.hidden ? "Publish" : "Hide"}
              </button>
              <button className="bg-rose-100 text-rose-700 hover:bg-rose-700 hover:text-white px-3 py-1.5 rounded-md text-xs font-bold uppercase transition">
                Delete
              </button>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-10 px-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Lesson Header */}
          <header className="p-8 border-b bg-gray-50/50">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase rounded">
                {lesson.type}
              </span>
              {lesson.hidden && (
                <span className="text-[10px] font-bold text-amber-600 uppercase">
                  Draft Mode
                </span>
              )}
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              {lesson.title}
            </h1>
          </header>

          <div className="p-8">
            {/* Video content */}
            {lesson.type === "video" ? (
              <div className="space-y-6">
                <div className="shadow-2xl rounded-xl overflow-hidden bg-black">
                  <iframe
                    className="w-full aspect-video"
                    src={lesson.content.replace("watch?v=", "embed/")}
                    allowFullScreen
                    title={lesson.title}
                  />
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-sm text-slate-500 flex items-center">
                    <span className="mr-2">🔗</span> Source:{" "}
                    <a
                      href={lesson.content}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-1 text-blue-600 hover:underline break-all"
                    >
                      {lesson.content}
                    </a>
                  </p>
                </div>
              </div>
            ) : /* Quiz content */
            lesson.type === "quiz" ? (
              <div className="space-y-8">
                {lesson.questions.map((q, qIdx) => (
                  <div
                    key={qIdx}
                    className="p-6 rounded-xl border border-gray-100 bg-white shadow-sm ring-1 ring-gray-900/5"
                  >
                    <p className="text-lg font-semibold text-slate-800 mb-4">
                      <span className="text-blue-600 mr-2">Q{qIdx + 1}.</span>{" "}
                      {q.questionText}
                    </p>

                    {q.codeSnippet && (
                      <div className="mb-4 rounded-lg overflow-hidden border border-slate-800">
                        <pre className="bg-slate-900 text-slate-50 p-4 text-sm font-mono overflow-x-auto">
                          <code>{q.codeSnippet}</code>
                        </pre>
                      </div>
                    )}

                    <div className="grid gap-3">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = quizAnswers[qIdx] === oIdx;
                        const isCorrect = q.correctAnswerIndex === oIdx;

                        let btnStyle =
                          "border-gray-200 hover:border-blue-300 hover:bg-blue-50";
                        if (quizSubmitted) {
                          if (isCorrect)
                            btnStyle =
                              "bg-emerald-50 border-emerald-500 text-emerald-900 ring-1 ring-emerald-500";
                          else if (isSelected)
                            btnStyle =
                              "bg-rose-50 border-rose-500 text-rose-900 ring-1 ring-rose-500";
                          else btnStyle = "opacity-50 border-gray-100";
                        } else if (isSelected) {
                          btnStyle =
                            "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200";
                        }

                        return (
                          <button
                            key={oIdx}
                            disabled={quizSubmitted}
                            onClick={() =>
                              setQuizAnswers({ ...quizAnswers, [qIdx]: oIdx })
                            }
                            className={`group flex items-center text-left p-4 border rounded-xl font-medium transition-all duration-200 ${btnStyle}`}
                          >
                            <span
                              className={`w-6 h-6 rounded-full border mr-3 flex items-center justify-center text-xs shrink-0 ${isSelected ? "bg-white text-blue-600" : "bg-gray-50 text-gray-400 group-hover:text-blue-500"}`}
                            >
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {!quizSubmitted ? (
                  <button
                    onClick={handleQuizSubmit}
                    disabled={
                      Object.keys(quizAnswers).length < lesson.questions.length
                    }
                    className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg transition shadow-lg active:scale-[0.98]"
                  >
                    Check Results
                  </button>
                ) : (
                  <div className="p-8 bg-blue-600 rounded-2xl text-white text-center shadow-xl">
                    <h3 className="text-lg font-medium opacity-90 mb-1">
                      Quiz Completed!
                    </h3>
                    <p className="text-5xl font-black mb-4">
                      {Math.round((score / lesson.questions.length) * 100)}%
                    </p>
                    <p className="mb-6 font-medium">
                      You got {score} out of {lesson.questions.length} correct.
                    </p>
                    <button
                      onClick={() => {
                        setQuizSubmitted(false);
                        setQuizAnswers({});
                        setScore(0);
                      }}
                      className="bg-white text-blue-600 px-6 py-2 rounded-full font-bold hover:bg-blue-50 transition"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Text content */
              <div className="max-w-none">
                <div
                  className="prose prose-slate max-w-none 
      [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-8 [&_h2]:mb-4
      [&_ul]:list-disc [&_ul]:ml-6
      [&_ol]:list-decimal [&_ol]:ml-6
      [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:pl-4 [&_blockquote]:italic
      /* Added Quote Logic Below */
      [&_blockquote_p:first-of-type]:before:content-['“'] 
      [&_blockquote_p:last-of-type]:after:content-['”']
      [&_blockquote_p]:before:text-blue-500 [&_blockquote_p]:before:font-serif [&_blockquote_p]:before:text-xl
      [&_blockquote_p]:after:text-blue-500 [&_blockquote_p]:after:font-serif [&_blockquote_p]:after:text-xl"
                  dangerouslySetInnerHTML={{ __html: lesson.content }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-12 flex justify-between items-center text-gray-500 border-t pt-8">
          <p className="text-sm italic">
            End of lesson: <strong>{lesson.title}</strong>
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-xs font-bold uppercase tracking-widest hover:text-blue-600 transition"
          >
            Back to Top ↑
          </button>
        </div>
      </main>
    </div>
  );
};

export default LessonPage;

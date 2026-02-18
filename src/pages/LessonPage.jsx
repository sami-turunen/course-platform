import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const LessonPage = () => {
	const { courseId, topicId, lessonId } = useParams();
	const [lesson, setLesson] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [user, setUser] = useState(null);

	// Quiz State
	const [quizAnswers, setQuizAnswers] = useState({});
	const [quizSubmitted, setQuizSubmitted] = useState(false);
	const [score, setScore] = useState(0);

	useEffect(() => {
		setUser(JSON.parse(localStorage.getItem("user")));
	}, []);

	useEffect(() => {
		const fetchLesson = async () => {
			try {
				const res = await axios.get(`/api/courses/${courseId}/topics/${topicId}/lessons/${lessonId}`);
				setLesson(res.data);
			} catch (err) {
				console.error(err);
				setError(err.response?.data?.error || "Failed to load lesson");
			} finally {
				setLoading(false);
			}
		};

		if (courseId && topicId && lessonId) {
			fetchLesson();
		}
	}, [courseId, topicId, lessonId]);

	const handleQuizSubmit = () => {
		let correctCount = 0;
		if (lesson.questions) {
			lesson.questions.forEach((q, idx) => {
				if (quizAnswers[idx] === q.correctAnswerIndex) correctCount++;
			});
		}
		setScore(correctCount);
		setQuizSubmitted(true);
	};

	const deleteLesson = async () => {
		try {
			await axios.delete(`http://localhost:3001/api/courses/${courseId}/topics/${topicId}/lessons/${lessonId}`);
			window.location.href = `/courses/${courseId}`;
		} catch (err) {
			console.error(err);
			setError(err.response?.data?.error || "Failed to delete lesson");
		}
	};

	if (loading) return <div className="main-content">Loading...</div>;
	if (error) return <div className="main-content error-msg">{error}</div>;
	if (!lesson) return <div className="main-content">Lesson not found</div>;

	return (
		<div className="lesson-page">
			<div className="card">
				<div style={{ marginBottom: "2rem" }}>
					<Link to={`/courses/${courseId}`} className="btn-secondary">
						&larr; Back to Course
					</Link>
					{user.role === "admin" || user.role === "instructor" ? (
						<button onClick={deleteLesson} className="btn-danger">
							Delete
						</button>
					) : null}
				</div>

				<h1>{lesson.title}</h1>

				<div className="lesson-content" style={{ marginTop: "2rem" }}>
					{lesson.type === "video" ? (
						<div className="video-content">
							<p style={{ marginBottom: "1rem" }}>Watch the video lesson here:</p>
							<a href={lesson.content} target="_blank" rel="noopener noreferrer" className="btn-primary">
								Open Video
							</a>
							{(lesson.content.includes("youtube.com") || lesson.content.includes("youtu.be")) && (
								<div style={{ marginTop: "2rem", position: "relative", paddingBottom: "56.25%", height: 0 }}>
									<iframe
										src={lesson.content.replace("watch?v=", "embed/")}
										title={lesson.title}
										style={{
											position: "absolute",
											top: 0,
											left: 0,
											width: "100%",
											height: "100%",
											border: 0
										}}
										allowFullScreen
									/>
								</div>
							)}
						</div>
					) : lesson.type === "quiz" ? (
						<div className="quiz-content">
							{user.role === "admin" || user.role === "instructor" ? (
								<button onClick={() => deleteLesson()} className="btn-danger">
									Delete
								</button>
							) : null}
							{lesson.questions &&
								lesson.questions.map((q, qIdx) => (
									<div key={qIdx} className="quiz-question card mb-4 border p-4 rounded">
										<h3 className="font-bold mb-2">
											{qIdx + 1}. {q.questionText}
										</h3>
										{q.codeSnippet && (
											<div className="code-snippet-container mb-4">
												<pre className="code-snippet">
													<code>{q.codeSnippet}</code>
												</pre>
											</div>
										)}
										<div className="options space-y-2">
											{q.options.map((opt, oIdx) => {
												const isSelected = quizAnswers[qIdx] === oIdx;
												const isCorrect = q.correctAnswerIndex === oIdx;
												let optionClass = "p-2 border rounded cursor-pointer ";

												if (quizSubmitted) {
													if (isCorrect) optionClass += "bg-green-100 border-green-500 ";
													else if (isSelected && !isCorrect) optionClass += "bg-red-100 border-red-500 ";
												} else if (isSelected) {
													optionClass += "bg-blue-50 border-blue-500 ";
												}

												return (
													<div
														key={oIdx}
														className={optionClass}
														onClick={() => {
															if (!quizSubmitted) {
																setQuizAnswers({ ...quizAnswers, [qIdx]: oIdx });
															}
														}}
													>
														<span className="font-medium mr-2">{String.fromCharCode(65 + oIdx)}.</span>
														{opt}
													</div>
												);
											})}
										</div>
									</div>
								))}

							{!quizSubmitted ? (
								<button onClick={handleQuizSubmit} className="btn-primary mt-4">
									Submit Quiz
								</button>
							) : (
								<div className="quiz-result mt-6 p-4 bg-gray-100 rounded text-center">
									<h2>
										Score: {score} / {lesson.questions.length}
									</h2>
									<button
										onClick={() => {
											setQuizSubmitted(false);
											setQuizAnswers({});
											setScore(0);
										}}
										className="btn-secondary mt-2"
									>
										Retake Quiz
									</button>
								</div>
							)}
						</div>
					) : (
						<div className="text-content" style={{ whiteSpace: "pre-wrap", lineHeight: "1.8" }}>
							{lesson.content}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default LessonPage;

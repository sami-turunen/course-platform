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

	// Topic State
	const [newTopicTitle, setNewTopicTitle] = useState("");
	const [isAddingTopic, setIsAddingTopic] = useState(false);

	// Lesson State
	const [activeTopicId, setActiveTopicId] = useState(null);
	const [addingType, setAddingType] = useState("lesson"); // "lesson" or "quiz"
	const [newLesson, setNewLesson] = useState({
		title: "",
		type: "text",
		content: ""
	});

	// Quiz State
	const [quizQuestions, setQuizQuestions] = useState([]);
	const [currentQuestion, setCurrentQuestion] = useState({
		questionText: "",
		codeSnippet: "",
		options: ["", "", "", ""],
		correctAnswerIndex: 0
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
			await axios.post(`/api/courses/${id}/topics/${activeTopicId}/lessons`, newLesson);
			setNewLesson({ title: "", type: "text", content: "" });
			setActiveTopicId(null);
			fetchCourse();
		} catch (err) {
			alert("Failed to add lesson");
		}
	};

	const handleAddQuiz = async (e) => {
		e.preventDefault();
		if (quizQuestions.length === 0) {
			alert("Please add at least one question");
			return;
		}
		try {
			await axios.post(`/api/courses/${id}/topics/${activeTopicId}/lessons`, {
				title: newLesson.title, // Recycle title from newLesson
				type: "quiz",
				questions: quizQuestions
			});
			setNewLesson({ title: "", type: "text", content: "" });
			setQuizQuestions([]);
			setActiveTopicId(null);
			fetchCourse();
		} catch (err) {
			alert("Failed to add quiz");
		}
	};

	const addQuestionToQuiz = () => {
		if (!currentQuestion.questionText) return;
		setQuizQuestions([...quizQuestions, currentQuestion]);
		setCurrentQuestion({
			questionText: "",
			codeSnippet: "",
			options: ["", "", "", ""],
			correctAnswerIndex: 0
		});
	};

	if (loading) return <div>Loading...</div>;
	if (!course) return <div>Course not found</div>;

	const isInstructor = user && (user.id === course.instructor._id || user.role === "admin");
	const isEnrolled = user && (course.studentsEnrolled.includes(user.id) || isInstructor);

	const handleViewLesson = (lesson) => {
		alert(lesson.content);
	};

	return (
		<div className="course-page">
			<div className="card">
				{!isEditing ? (
					<>
						<h1>{course.title}</h1>
						<p className="instructor">Instructor: {course.instructor.name}</p>
						<div className="description">Description: {course.description}</div>

						{isInstructor && (
							<div className="actions">
								<button onClick={() => setIsEditing(true)} className="btn-secondary">
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
							<input value={editData.title} onChange={(e) => setEditData({ ...editData, title: e.target.value })} />
						</div>
						<div className="form-group">
							<label>Description</label>
							<textarea
								value={editData.description}
								onChange={(e) => setEditData({ ...editData, description: e.target.value })}
								rows="5"
							/>
						</div>
						<button type="submit" className="btn-success">
							Save Changes
						</button>
						<button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">
							Cancel
						</button>
					</form>
				)}
			</div>

			<div className="course-content">
				<div>
					<h2>Course Content</h2>
					{isInstructor && (
						<button onClick={() => setIsAddingTopic(true)} className="btn-primary">
							Add Topic
						</button>
					)}
				</div>

				{isAddingTopic && (
					<div className="card">
						<form onSubmit={handleAddTopic} className="flex gap-2 items-center">
							<input
								className="input"
								placeholder="Topic Title"
								value={newTopicTitle}
								onChange={(e) => setNewTopicTitle(e.target.value)}
								required
							/>
							<button type="submit" className="btn-success">
								Add
							</button>
							<button type="button" onClick={() => setIsAddingTopic(false)} className="btn-secondary">
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
											<div className="flex gap-2">
												<button
													onClick={() => {
														if (activeTopicId === topic._id && addingType === "lesson") {
															setActiveTopicId(null);
														} else {
															setActiveTopicId(topic._id);
															setAddingType("lesson");
														}
													}}
													className="btn-sm"
												>
													{activeTopicId === topic._id && addingType === "lesson" ? "Cancel" : "Add Lesson"}
												</button>
												<button
													onClick={() => {
														if (activeTopicId === topic._id && addingType === "quiz") {
															setActiveTopicId(null);
														} else {
															setActiveTopicId(topic._id);
															setAddingType("quiz");
														}
													}}
													className="btn-sm"
												>
													{activeTopicId === topic._id && addingType === "quiz" ? "Cancel" : "Add Quiz"}
												</button>
											</div>
										)}
									</div>

									{activeTopicId === topic._id && (
										<div className="add-lesson-form card mt-4 border border-gray-200">
											<h4 className="mb-4">
												{addingType === "quiz" ? `Add Quiz to ${topic.title}` : `Add Lesson to ${topic.title}`}
											</h4>

											{addingType === "lesson" ? (
												<form onSubmit={handleAddLesson}>
													<div className="form-group mb-3">
														<input
															placeholder="Lesson Title"
															className="w-full p-2 border rounded"
															value={newLesson.title}
															onChange={(e) =>
																setNewLesson({
																	...newLesson,
																	title: e.target.value
																})
															}
															required
														/>
													</div>
													<div className="form-group mb-3">
														<select
															className="w-full p-2 border rounded"
															value={newLesson.type}
															onChange={(e) =>
																setNewLesson({
																	...newLesson,
																	type: e.target.value
																})
															}
														>
															<option value="text">Text</option>
															<option value="video">Video URL</option>
														</select>
													</div>
													<div className="form-group mb-3">
														<textarea
															placeholder="Content or URL"
															className="w-full p-2 border rounded"
															value={newLesson.content}
															onChange={(e) =>
																setNewLesson({
																	...newLesson,
																	content: e.target.value
																})
															}
															required
															rows="4"
														/>
													</div>
													<div className="flex gap-2">
														<button type="submit" className="btn-success">
															Save Lesson
														</button>
														<button type="button" onClick={() => setActiveTopicId(null)} className="btn-secondary">
															Cancel
														</button>
													</div>
												</form>
											) : (
												<div className="quiz-builder">
													<div className="form-group mb-3">
														<label>Quiz Title</label>
														<input
															placeholder="Quiz Title"
															className="w-full p-2 border rounded"
															value={newLesson.title}
															onChange={(e) =>
																setNewLesson({
																	...newLesson,
																	title: e.target.value
																})
															}
														/>
													</div>

													<div className="questions-preview mb-4">
														<h5 className="font-bold mb-2">Questions ({quizQuestions.length})</h5>
														{quizQuestions.map((q, idx) => (
															<div key={idx} className="p-2 bg-gray-50 border rounded mb-2">
																<p className="font-medium">
																	{idx + 1}. {q.questionText}
																</p>
																{q.codeSnippet && (
																	<pre className="bg-gray-800 text-white p-2 rounded text-sm mt-1 overflow-x-auto">
																		<code>{q.codeSnippet}</code>
																	</pre>
																)}
																<ul className="pl-4 list-disc text-sm mt-1">
																	{q.options.map((opt, i) => (
																		<li
																			key={i}
																			className={i === q.correctAnswerIndex ? "text-green-600 font-bold" : ""}
																		>
																			{opt}
																		</li>
																	))}
																</ul>
															</div>
														))}
													</div>

													<div className="new-question-form p-4 border rounded bg-gray-50 mb-4">
														<h6 className="font-bold mb-2">New Question</h6>
														<div className="form-group mb-2">
															<input
																placeholder="Question Text"
																className="w-full p-2 border rounded"
																value={currentQuestion.questionText}
																onChange={(e) =>
																	setCurrentQuestion({
																		...currentQuestion,
																		questionText: e.target.value
																	})
																}
															/>
														</div>
														<div className="form-group mb-2">
															<textarea
																placeholder="Code Snippet (Optional)"
																className="w-full p-2 border rounded font-mono text-sm"
																rows="3"
																value={currentQuestion.codeSnippet}
																onChange={(e) =>
																	setCurrentQuestion({
																		...currentQuestion,
																		codeSnippet: e.target.value
																	})
																}
															/>
														</div>
														<div className="options-grid grid grid-cols-2 gap-2 mb-2">
															{currentQuestion.options.map((opt, idx) => (
																<div key={idx} className="flex items-center gap-1">
																	<input
																		type="radio"
																		name="correctAnswer"
																		checked={currentQuestion.correctAnswerIndex === idx}
																		onChange={() =>
																			setCurrentQuestion({
																				...currentQuestion,
																				correctAnswerIndex: idx
																			})
																		}
																	/>
																	<input
																		placeholder={`Option ${idx + 1}`}
																		className="w-full p-1 border rounded text-sm"
																		value={opt}
																		onChange={(e) => {
																			const newOptions = [...currentQuestion.options];
																			newOptions[idx] = e.target.value;
																			setCurrentQuestion({
																				...currentQuestion,
																				options: newOptions
																			});
																		}}
																	/>
																</div>
															))}
														</div>
														<button
															type="button"
															onClick={addQuestionToQuiz}
															className="btn-primary text-sm"
															disabled={!currentQuestion.questionText}
														>
															Add Question
														</button>
													</div>

													<div className="flex gap-2">
														<button onClick={handleAddQuiz} className="btn-success">
															Save Quiz
														</button>
														<button onClick={() => setActiveTopicId(null)} className="btn-secondary">
															Cancel
														</button>
													</div>
												</div>
											)}
										</div>
									)}

									<div className="lessons-list">
										{topic.lessons.length === 0 && <p>No lessons yet.</p>}
										{topic.lessons.map((lesson) => (
											<div key={lesson._id} className="lesson-item">
												<Link to={`/courses/${id}/topics/${topic._id}/lessons/${lesson._id}`}>{lesson.title}</Link>
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

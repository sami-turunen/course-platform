import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true }, // This is the actual question that the user needs to answer
  codeSnippet: { type: String }, // Optional code snippet
  options: [{ type: String, required: true }], // Options for the multiple choice questions
  correctAnswerIndex: { type: Number, required: true }, // The correct answer's index in the array
});

const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Title of the lesson
  type: { type: String, enum: ["video", "text", "quiz"], default: "text" }, // Type of content
  content: { type: String }, // For text content
  videoUrl: { type: String }, // For video content
  duration: { type: Number }, // In minutes
  questions: [QuestionSchema], // For quiz content
  hidden: { type: Boolean, default: false }, // Decided if the lesson is hidden from students
});

const TopicSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Title of the topic
  description: { type: String }, // Description of the topic
  lessons: [LessonSchema], // Array of lessons of type Lesson specified above
});

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Title of the course
    description: { type: String, required: true }, // Description of the course
    category: { type: String, default: "General" }, // Course category, or "General"
    // Instructor for the specific course, currently we don't support multiple instructors per course
    instructor: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    thumbnail: { type: String }, // URL to image
    topics: [TopicSchema], // Array of topics of type Topic specified above
    studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of students taking the course
  },
  { timestamps: true },
);

export default mongoose.model("Course", CourseSchema);

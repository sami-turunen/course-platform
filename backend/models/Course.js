import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema({
	title: { type: String, required: true },
	type: { type: String, enum: ["video", "text", "quiz"], default: "text" },
	content: { type: String }, // For text content
	videoUrl: { type: String }, // For video content
	duration: { type: Number }, // In minutes
	freePreview: { type: Boolean, default: false }
});

const TopicSchema = new mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String },
	lessons: [LessonSchema]
});

const CourseSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		category: { type: String, default: "General" },
		instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		price: { type: Number, default: 0 },
		thumbnail: { type: String }, // URL to image
		topics: [TopicSchema],
		studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
	},
	{ timestamps: true }
);

export default mongoose.model("Course", CourseSchema);

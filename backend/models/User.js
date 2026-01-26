import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		username: { type: String, unique: true },
		password: { type: String, required: true },
		role: {
			type: String,
			enum: ["student", "instructor", "admin"],
			default: "student"
		}
	},
	{ timestamps: true }
);

export default mongoose.model("User", UserSchema);

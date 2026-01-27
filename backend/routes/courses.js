import express from "express";
import Course from "../models/Course.js";
import { verifyToken, verifyInstructor } from "../middleware/auth.js";

const router = express.Router();

// Get all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().populate("instructor", "name email");
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single course
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "instructor",
      "name",
    );
    res.status(200).json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create course (Instructor/Admin only)
router.post("/", verifyToken, verifyInstructor, async (req, res) => {
  try {
    const newCourse = new Course({
      ...req.body,
      instructor: req.user.id,
    });
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update course
router.put("/:id", verifyToken, verifyInstructor, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });

    if (
      course.instructor.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res.json(updatedCourse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete course
router.delete("/:id", verifyToken, verifyInstructor, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });

    if (
      course.instructor.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add Topic
router.post("/:id/topics", verifyToken, verifyInstructor, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });
    if (
      course.instructor.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "Not authorized" });
    }

    course.topics.push({ title: req.body.title, lessons: [] });
    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add Lesson to Topic
router.post(
  "/:id/topics/:topicId/lessons",
  verifyToken,
  verifyInstructor,
  async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);
      if (!course) return res.status(404).json({ error: "Course not found" });
      if (
        course.instructor.toString() !== req.user.id &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({ error: "Not authorized" });
      }

      const topic = course.topics.id(req.params.topicId);
      if (!topic) return res.status(404).json({ error: "Topic not found" });

      topic.lessons.push(req.body);
      await course.save();
      res.json(course);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

// Enroll in a course
router.post("/:id/enroll", verifyToken, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course.studentsEnrolled.includes(req.user.id)) {
      course.studentsEnrolled.push(req.user.id);
      await course.save();
      res.status(200).json({ message: "Enrolled successfully" });
    } else {
      res.status(400).json({ message: "Already enrolled" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// // Add a topic to a course
// router.post("/:id/topics", verifyToken, verifyInstructor, async (req, res) => {
// 	try {
// 		const course = await Course.findById(req.params.id);
// 		if (!course) return res.status(404).json({ error: "Course not found" });

// 		if (course.instructor.toString() !== req.user.id && req.user.role !== "admin") {
// 			return res.status(403).json({ error: "Not authorized" });
// 		}

// 		course.topics.push(req.body);
// 		await course.save();
// 		res.status(201).json(course);
// 	} catch (err) {
// 		res.status(500).json({ error: err.message });
// 	}
// });

// // Add a lesson to a topic
// router.post(
//   "/:id/topics/:topicId/lessons",
//   verifyToken,
//   verifyInstructor,
//   async (req, res) => {
//     try {
//       const course = await Course.findById(req.params.id);
//       if (!course) return res.status(404).json({ error: "Course not found" });

//       if (
//         course.instructor.toString() !== req.user.id &&
//         req.user.role !== "admin"
//       ) {
//         return res.status(403).json({ error: "Not authorized" });
//       }

//       const topic = course.topics.id(req.params.topicId);
//       if (!topic) return res.status(404).json({ error: "Topic not found" });

//       topic.lessons.push(req.body);
//       await course.save();
//       res.status(201).json(course);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   },
// );

export default router;

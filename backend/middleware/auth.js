import jwt from "jsonwebtoken";

// Function for token verification
export const verifyToken = (req, res, next) => {
	const authHeader = req.header("Authorization");
	if (!authHeader) return res.status(401).json({ error: "Access Denied" });

	const token = authHeader.split(" ")[1];
	if (!token) return res.status(401).json({ error: "Access Denied" });

	try {
		const verified = jwt.verify(token, process.env.JWT_SECRET);
		req.user = verified;
		next();
	} catch (err) {
		res.status(400).json({ error: "Invalid Token" });
	}
};

// Function to verify that the user has at least the privileges of an instructor
// An admin has the privileges of an instructor + can manage platform users
export const verifyInstructor = (req, res, next) => {
	if (req.user.role === "instructor" || req.user.role === "admin") {
		next();
	} else {
		res.status(403).json({ error: "Access Denied" });
	}
};

// Function to verify that the user has the privileges of an admin
export const verifyAdmin = (req, res, next) => {
	if (req.user.role === "admin") {
		next();
	} else {
		res.status(403).json({ error: "Access Denied" });
	}
};

import jwt from "jsonwebtoken";

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

export const verifyInstructor = (req, res, next) => {
	if (req.user.role === "instructor" || req.user.role === "admin") {
		next();
	} else {
		res.status(403).json({ error: "Access Denied" });
	}
};

export const verifyAdmin = (req, res, next) => {
	if (req.user.role === "admin") {
		next();
	} else {
		res.status(403).json({ error: "Access Denied" });
	}
};

import jwt from "jsonwebtoken";
const JWT_SECRET = process.env["JWT_SECRET"] || "supersecretkey";
export function authMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        res.status(401).json({ error: "No token provided" });
        return;
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(403).json({ error: "Invalid token" });
        return;
    }
}
export function requireRole(role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            res.status(403).json({ error: "Forbidden" });
            return;
        }
        next();
    };
}
//# sourceMappingURL=auth.js.map
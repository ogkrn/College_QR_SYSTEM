import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env["JWT_SECRET"] || "supersecretkey";
export async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}
export async function comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
}
export function generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}
export function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}
//# sourceMappingURL=jwt.js.map
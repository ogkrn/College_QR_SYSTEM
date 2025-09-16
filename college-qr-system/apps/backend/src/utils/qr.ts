import jwt from "jsonwebtoken";

const QR_SECRET = process.env["QR_SECRET"] || "qr_secret_key";

// Generate a QR token valid for 60 seconds
export function generateQRToken(guardId: string) {
  return jwt.sign(
    { guardId }, // payload
    QR_SECRET,
    { expiresIn: "60s" } // short-lived
  );
}

// Verify QR token
export function verifyQRToken(token: string) {
  try {
    return jwt.verify(token, QR_SECRET);
  } catch (err) {
    return null;
  }
}
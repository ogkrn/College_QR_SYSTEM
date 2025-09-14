import { app } from "./app.js";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env["PORT"] || 4000;

// Root route
app.get("/", (req, res) => {
  res.send("🚀 Server is working!");
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map
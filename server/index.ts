import express from "express";
import dotenv from "dotenv";
import path from "path";
import apiRoutes from "./routes/api.routes";
import { errorHandler } from "./middleware/errorHandler";
import { logger } from "./utils/logger";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`, {
    query: req.query,
    body: req.method !== "GET" ? req.body : undefined,
    headers: { authorization: req.headers.authorization }
  });
  next();
});

app.use("/api", apiRoutes);

app.get("/api", (req, res) => {
  res.json({ message: "Hello from the custom server!" });
});

app.use(errorHandler);

app.use((req, res) => {
  logger.warn(`${req.method} ${req.url} not found`);
  res.status(404).json({
    error: { message: "Route not found", code: "NOT_FOUND", status: 404 }
  });
});

if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "../react-ui/build");
  app.use(express.static(buildPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
}

app.listen(PORT, async () => {
  logger.info(`Server running on port ${PORT}`);
});

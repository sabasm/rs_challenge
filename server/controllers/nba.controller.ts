import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import ApiService from "../services/api.service";
import { logger } from "../utils/logger";

dotenv.config();
const apiKey = process.env.BALLDONTLIE_API_KEY || "";
if (!apiKey) {
  throw new Error("API key is missing. Please set the BALLDONTLIE_API_KEY environment variable.");
}
const apiService = new ApiService("https://api.balldontlie.io/v1", {
  headers: { Authorization: apiKey }
});
console.log("NBA API Key (first 8 chars):", apiKey.substring(0, 8) + "...");

export const getNBATeams = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const teams = await apiService.get("/teams");
    logger.info("Fetched NBA teams", teams);
    res.json(teams);
  } catch (err: any) {
    logger.error("Error fetching NBA teams", err);
    next(err);
  }
};

export const getNBATeamById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const teamId = req.params.id;
    if (!teamId || isNaN(Number(teamId))) {
      res.status(400).json({
        error: {
          message: "Invalid team ID",
          code: "INVALID_TEAM_ID",
          status: 400
        }
      });
      return;
    }
    const data = await apiService.get(`/teams/${teamId}`);
    if (!data || typeof data !== "object") {
      res.status(502).json({
        error: {
          message: "Invalid response format from provider",
          code: "INVALID_RESPONSE",
          status: 502
        }
      });
      return;
    }
    if ("data" in data && typeof data.data === "object") {
      res.json(data.data);
      return;
    }
    res.status(502).json({
      error: {
        message: "Malformed data structure",
        code: "MALFORMED_DATA",
        status: 502
      }
    });
  } catch (err: any) {
    const status = err.status || 500;
    if (
      err.response?.data &&
      typeof err.response.data === "string" &&
      err.response.data.includes("<!DOCTYPE html>")
    ) {
      res.status(502).json({
        error: {
          message: "Received unexpected HTML from external API",
          code: "INVALID_CONTENT_TYPE",
          status: 502
        }
      });
      return;
    }
    if (status === 404) {
      res.status(404).json({
        error: {
          message: "Team not found",
          code: "NOT_FOUND",
          status
        }
      });
      return;
    }
    if (status === 401) {
      res.status(401).json({
        error: {
          message: "Unauthorized - check API key or tier",
          code: "UNAUTHORIZED",
          status
        }
      });
      return;
    }
    if (status === 429) {
      res.status(429).json({
        error: {
          message: "Rate limit exceeded",
          code: "RATE_LIMIT",
          status
        }
      });
      return;
    }
    if (status >= 500) {
      res.status(503).json({
        error: {
          message: "External API is currently unavailable",
          code: "EXTERNAL_SERVICE_ERROR",
          status: 503
        }
      });
      return;
    }
    res.status(status).json({
      error: {
        message: err.message || "Unexpected error",
        code: err.code || "UNEXPECTED_ERROR",
        status
      }
    });
  }
};

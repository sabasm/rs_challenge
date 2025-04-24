import { Request, Response, NextFunction } from "express";
import weatherService from "../services/weather.service";

export const getWeatherByCity = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { city } = req.params;
    if (!city) {
      res.status(400).json({ error: "City parameter is required" });
      return;
    }
    const weatherData = await weatherService.getWeatherByCity(city);
    res.json({ data: weatherData });
  } catch (err: any) {
    res.status(500).json({
      error: "Failed to fetch weather data",
      message: err.message
    });
  }
};

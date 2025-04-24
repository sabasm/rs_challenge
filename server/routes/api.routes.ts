import { Router } from "express";
import { getNBATeams, getNBATeamById } from "../controllers/nba.controller";
import { getWeatherByCity } from "../controllers/weather.controller";

const router = Router();

router.get("/nba/teams", getNBATeams);
router.get("/nba/teams/:id", getNBATeamById);
router.get("/weather/:city", getWeatherByCity);

export default router;

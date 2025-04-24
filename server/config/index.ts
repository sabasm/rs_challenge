import dotenv from "dotenv"
dotenv.config()

const toNum = (v: string | undefined, def: number) => {
  const n = parseInt(v || "", 10)
  return Number.isNaN(n) ? def : n
}

const CONFIG = {
  env: process.env.NODE_ENV || "development",
  port: toNum(process.env.PORT, 5000),
  apiKeys: {
    nba: process.env.BALLDONTLIE_API_KEY || "",
    weather: process.env.WEATHER_API_KEY || ""
  },
  security: {
    allowedOrigins: (process.env.CLIENT_URL || "").split(",").filter(Boolean)
  },
  cacheTTL: {
    nba: 5 * 60 * 1000,
    weather: 5 * 60 * 1000
  }
}

export default CONFIG



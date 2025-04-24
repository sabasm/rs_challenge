const CONFIG = {
  API: {
    BASE_URL: process.env.REACT_APP_API_BASE || "/api",
    TIMEOUT: 10000
  },
  CACHE_TTL: {
    nba: 5 * 60 * 1000,
    weather: 5 * 60 * 1000
  }
}

export default CONFIG



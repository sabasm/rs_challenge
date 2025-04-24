import { ApiService } from "./api.service"
import { WeatherData } from "../types/weather.types"
import dotenv from "dotenv"

dotenv.config()

class WeatherService {
  private api: ApiService
  private apiKey: string
  private cache: Map<string, { data: any; timestamp: number }> = new Map()
  private CACHE_TTL = 1000 * 60 * 5

  constructor() {
    this.apiKey = process.env.WEATHER_API_KEY || ""
    this.api = new ApiService("https://api.weatherapi.com/v1")
  }

  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key)
    return !!cached && Date.now() - cached.timestamp < this.CACHE_TTL
  }

  private getCached<T>(key: string): T | null {
    return this.isCacheValid(key) ? (this.cache.get(key)?.data as T) : null
  }

  private setCached<T>(key: string, data: T) {
    this.cache.set(key, { data, timestamp: Date.now() })
  }

  async getWeatherByCity(city: string): Promise<WeatherData> {
    if (!this.apiKey) throw new Error("Weather API key not configured")
    const key = `weather_${city.toLowerCase()}`
    const cached = this.getCached<WeatherData>(key)
    if (cached) return cached
    const response = await this.api.get<WeatherData>("/current.json", {
      params: { key: this.apiKey, q: city, aqi: "no" }
    })
    this.setCached(key, response)
    return response
  }
}

export default new WeatherService()



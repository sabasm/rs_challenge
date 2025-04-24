import { ApiService } from "./api.service"
import { NBATeam } from "../types/nba.types"

class NBAService {
  private api: ApiService
  private cache: Map<string, { data: any; timestamp: number }> = new Map()
  private CACHE_TTL = 1000 * 60 * 5

  constructor() {
    this.api = new ApiService("https://api.balldontlie.io/v1")
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

  async getAllTeams(): Promise<NBATeam[]> {
    const key = "all_teams"
    const cached = this.getCached<NBATeam[]>(key)
    if (cached) return cached
    const response = await this.api.get<{ data: NBATeam[] }>("/teams")
    this.setCached(key, response.data)
    return response.data
  }

  async getTeamById(id: number): Promise<NBATeam> {
    const key = `team_${id}`
    const cached = this.getCached<NBATeam>(key)
    if (cached) return cached
    const response = await this.api.get<NBATeam>(`/teams/${id}`)
    this.setCached(key, response)
    return response
  }
}

export default new NBAService()



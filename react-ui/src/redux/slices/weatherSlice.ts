import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import { WeatherData } from "../../types/weather.types"
import api from "../../api/axios"
import type { RootState } from "../store"

const CACHE_TTL = 5 * 60 * 1000

interface CachedWeather {
  data: WeatherData
  timestamp: number
}

interface WeatherState {
  cityWeather: Record<string, CachedWeather>
  loading: boolean
  error: string | null
}

const initialState: WeatherState = {
  cityWeather: {},
  loading: false,
  error: null
}

export const fetchWeatherByCity = createAsyncThunk<
  { city: string; data: WeatherData },
  string,
  { state: RootState; rejectValue: string }
>("weather/fetchByCity", async (city, { getState, rejectWithValue }) => {
  const key = city.toLowerCase()
  const cached = (getState().weather as WeatherState).cityWeather[key]
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return { city: key, data: cached.data }
  }
  try {
    const res = await api.get<{ data: WeatherData }>(`/weather/${encodeURIComponent(city)}`)
    return { city: key, data: res.data.data }
  } catch (e: any) {
    return rejectWithValue(e.message)
  }
})

export const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    clearWeatherData: (state, action: PayloadAction<string | undefined>) => {
      if (action.payload) delete state.cityWeather[action.payload.toLowerCase()]
      else state.cityWeather = {}
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherByCity.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        fetchWeatherByCity.fulfilled,
        (state, action: PayloadAction<{ city: string; data: WeatherData }>) => {
          state.loading = false
          state.cityWeather[action.payload.city] = {
            data: action.payload.data,
            timestamp: Date.now()
          }
        }
      )
      .addCase(fetchWeatherByCity.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export const { clearWeatherData } = weatherSlice.actions
export default weatherSlice.reducer


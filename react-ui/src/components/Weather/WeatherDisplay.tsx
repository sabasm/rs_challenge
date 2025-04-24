import React, { useEffect } from "react"
import {
  Typography,
  Paper,
  CircularProgress,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia
} from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { fetchWeatherByCity } from "../../redux/slices/weatherSlice"

const WeatherDisplay: React.FC = () => {
  const dispatch = useAppDispatch()
  const { selectedTeam } = useAppSelector((state) => state.nba)
  const { cityWeather, loading, error } = useAppSelector((state) => state.weather)

  const cityKey = selectedTeam?.city.toLowerCase() || ""
  const weatherData = cityKey ? cityWeather[cityKey]?.data : null

  useEffect(() => {
    if (selectedTeam) {
      dispatch(fetchWeatherByCity(selectedTeam.city))
    }
  }, [selectedTeam, dispatch])

  if (!selectedTeam) return null

  if (loading && !weatherData) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error && !weatherData) {
    return (
      <Paper elevation={3} sx={{ p: 2, mt: 2, backgroundColor: "#fff4f4" }}>
        <Typography color="error" variant="h6">
          Error loading weather data
        </Typography>
        <Typography color="error">{error}</Typography>
      </Paper>
    )
  }

  if (!weatherData) return null

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 3, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h5" gutterBottom>
        Weather in {selectedTeam.city}
      </Typography>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={4}>
              {weatherData.current.condition.icon && (
                <CardMedia
                  component="img"
                  image={`https:${weatherData.current.condition.icon}`}
                  alt={weatherData.current.condition.text}
                  sx={{ width: 80, height: 80, mx: "auto" }}
                />
              )}
            </Grid>
            <Grid item xs={8}>
              <Typography variant="h6">
                {weatherData.current.temp_c}°C / {weatherData.current.temp_f}°F
              </Typography>
              <Typography variant="body1">
                {weatherData.current.condition.text}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="body2">Humidity: {weatherData.current.humidity}%</Typography>
          <Typography variant="body2">Wind: {weatherData.current.wind_kph} km/h</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2">Feels like: {weatherData.current.feelslike_c}°C</Typography>
          <Typography variant="body2">Updated: {weatherData.current.last_updated}</Typography>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default WeatherDisplay



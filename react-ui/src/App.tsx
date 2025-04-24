import { Box, Container, CssBaseline, Typography } from "@mui/material";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import TeamList from "./components/Teams/TeamList";
import WeatherDisplay from "./components/Weather/WeatherDisplay";
import TeamDetail from "./components/Teams/TeamDetail";
import rsLogo from "./logo-with-name.png";
import "./App.css";

export const App = () => {
  return (
    <Provider store={store}>
      <CssBaseline />
      <div className="App">
        <header className="App-header">
          <img src={rsLogo} className="App-logo" alt="logo" />
        </header>
        <Container maxWidth="md">
          <Box sx={{ mt: 4, mb: 8 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              NBA Teams & Weather App
            </Typography>
            <Typography variant="body1" align="center" sx={{ mb: 4 }}>
              Select a team to see the current weather in their city
            </Typography>
            <TeamList />
            <TeamDetail />
            <WeatherDisplay />
          </Box>
        </Container>
      </div>
    </Provider>
  );
};

import React, { useState } from "react";
import {
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Paper,
  CircularProgress,
  Box
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchNBATeams, selectTeam } from "../../redux/slices/nbaSlice";
import { NBATeam } from "../../types/nba.types";

const TeamList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { teams, loading, error } = useSelector((state: RootState) => state.nba);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFetchTeams = () => {
    dispatch(fetchNBATeams());
    setIsExpanded(true);
  };

  const handleSelectTeam = (team: NBATeam) => {
    dispatch(selectTeam(team));
  };

  if (error) {
    return (
      <Paper elevation={3} sx={{ p: 2, mt: 2, backgroundColor: "#fff4f4" }}>
        <Typography color="error" variant="h6">
          Error loading teams
        </Typography>
        <Typography color="error">{error}</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h5" gutterBottom>
        NBA Teams
      </Typography>

      {!isExpanded ? (
        <Button
          variant="contained"
          color="primary"
          onClick={handleFetchTeams}
          disabled={loading}
          fullWidth
          sx={{ mb: 2 }}
        >
          {loading ? "Loading..." : "Show NBA Teams"}
        </Button>
      ) : loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <List sx={{ maxHeight: 400, overflow: 'auto', bgcolor: 'background.paper' }}>
          {teams.map((team) => (
            <ListItem key={team.id} disablePadding>
              <ListItemButton onClick={() => handleSelectTeam(team)}>
                <ListItemText
                  primary={team.full_name}
                  secondary={`${team.city} (${team.conference} Conference)`}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default TeamList;



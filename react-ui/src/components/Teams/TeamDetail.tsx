import React from "react";
import {
  Typography,
  Paper,
  Box,
  Card,
  CardContent,
  Divider
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const TeamDetail: React.FC = () => {
  const { selectedTeam } = useSelector((state: RootState) => state.nba);

  if (!selectedTeam) {
    return null;
  }

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 3, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h5" gutterBottom>
        {selectedTeam.full_name}
      </Typography>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body1">
              <strong>City:</strong> {selectedTeam.city}
            </Typography>
            <Typography variant="body1">
              <strong>Abbreviation:</strong> {selectedTeam.abbreviation}
            </Typography>
          </Box>

          <Divider sx={{ my: 1.5 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body1">
              <strong>Conference:</strong> {selectedTeam.conference}
            </Typography>
            <Typography variant="body1">
              <strong>Division:</strong> {selectedTeam.division}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Paper>
  );
};

export default TeamDetail;



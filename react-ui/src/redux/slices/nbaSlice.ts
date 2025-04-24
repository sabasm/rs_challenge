import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { NBATeam } from "../../types/nba.types";
import api from "../../api/axios";
import type { RootState } from "../store";

const CACHE_TTL = 5 * 60 * 1000;

interface NBAState {
  teams: NBATeam[];
  selectedTeam: NBATeam | null;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: NBAState = {
  teams: [],
  selectedTeam: null,
  loading: false,
  error: null,
  lastFetched: null
};

export const fetchNBATeams = createAsyncThunk<
  NBATeam[],
  void,
  { state: RootState; rejectValue: string }
>("nba/fetchTeams", async (_, { getState, rejectWithValue }) => {
  const { teams, lastFetched } = getState().nba as NBAState;
  if (teams.length && lastFetched && Date.now() - lastFetched < CACHE_TTL) {
    return teams;
  }
  try {
    const res = await api.get<{ data: NBATeam[] }>("/nba/teams");
    return res.data.data;
  } catch (e: any) {
    return rejectWithValue(e.message);
  }
});

export const nbaSlice = createSlice({
  name: "nba",
  initialState,
  reducers: {
    selectTeam: (state, action: PayloadAction<NBATeam>) => {
      state.selectedTeam = action.payload;
    },
    clearSelectedTeam: (state) => {
      state.selectedTeam = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNBATeams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNBATeams.fulfilled, (state, action: PayloadAction<NBATeam[]>) => {
        state.loading = false;
        state.teams = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchNBATeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { selectTeam, clearSelectedTeam } = nbaSlice.actions;
export default nbaSlice.reducer;

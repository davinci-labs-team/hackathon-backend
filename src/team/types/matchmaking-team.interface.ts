export interface MatchmakingTeam {
  team_id: string;
  members: { user_id: string; school: string }[];
}

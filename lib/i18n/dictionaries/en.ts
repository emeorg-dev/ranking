import type { TranslationDictionary } from "../types";

export const en = {
  common: {
    theme: {
      label: "Theme",
      light: "Light",
      dark: "Dark",
      system: "System",
    },
    language: {
      label: "Language",
      spanish: "Spanish",
      english: "English",
    },
    actions: {
      cancel: "Cancel",
      close: "Close",
      confirm: "Confirm",
      changeScreen: "change screen",
      showRanking: "show ranking",
      reset: "Reset",
    },
    status: {
      loading: "Loading…",
    },
  },
  ranking: {
    common: {
      title: "Ranking",
    },
    navigation: {
      scores: "Scores",
      ranking: "Ranking",
    },
    reveal: {
      revealing: "Revealing ranking…",
      visible: "Ranking visible",
      hidden: "Ranking hidden — show when ready",
      instantView: "Quick view",
      show: "Show ranking",
      showAll: "Show all",
      hide: "Hide ranking",
    },
    settings: {
      competitionName: "Competition name",
      showName: "Show name",
    },
    scoreEntry: {
      title: "Score entry",
      team: "team",
      teams: "teams",
      round: "round",
      rounds: "rounds",
      searchTeams: "Search teams…",
      addTeamPlaceholder: "New team name",
      addTeam: "Add team",
      addRound: "Add round",
    },
    table: {
      team: "Team",
      total: "Total",
      roundName: "Round {0}",
      unnamedRound: "Unnamed round",
      deleteTeam: "Delete team",
      deleteRound: "Delete round",
      noTeamsYet: "No teams yet. Add the first team to begin.",
      noTeamsMatch: "No teams matched your search.",
    },
    dialogs: {
      deleteTeamTitle: "Delete team?",
      deleteTeamDesc: "\"{0}\" and all its scores will be deleted. This action cannot be undone.",
      deleteTeamConfirm: "Delete team",
      deleteRoundTitle: "Delete round?",
      deleteRoundDesc: "\"{0}\" and all scores associated with this round will be deleted. This action cannot be undone.",
      deleteRoundConfirm: "Delete round",
    },
  },
} satisfies TranslationDictionary;

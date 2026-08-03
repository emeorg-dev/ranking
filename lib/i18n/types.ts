export type Locale = "es" | "en"

export type TranslationDictionary = {
  common: {
    theme: {
      label: string
      light: string
      dark: string
      system: string
    }
    language: {
      label: string
      spanish: string
      english: string
    }
    actions: {
      cancel: string
      close: string
      confirm: string
      changeScreen: string
      showRanking: string
      reset: string
    }
    status: {
      loading: string
    }
  }
  ranking: {
    common: {
      title: string
    }
    navigation: {
      scores: string
      ranking: string
    }
    reveal: {
      revealing: string
      visible: string
      hidden: string
      instantView: string
      show: string
      showAll: string
      hide: string
    }
    settings: {
      competitionName: string
      showName: string
    }
    scoreEntry: {
      title: string
      team: string
      teams: string
      round: string
      rounds: string
      searchTeams: string
      addTeamPlaceholder: string
      addTeam: string
      addRound: string
    }
    table: {
      team: string
      total: string
      roundName: string
      unnamedRound: string
      deleteTeam: string
      deleteRound: string
      noTeamsYet: string
      noTeamsMatch: string
    }
    dialogs: {
      deleteTeamTitle: string
      deleteTeamDesc: string
      deleteTeamConfirm: string
      deleteRoundTitle: string
      deleteRoundDesc: string
      deleteRoundConfirm: string
    }
  }
}


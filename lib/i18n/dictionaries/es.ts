export const es = {
  common: {
    theme: {
      label: "Tema",
      light: "Claro",
      dark: "Oscuro",
      system: "Sistema",
    },
    language: {
      label: "Idioma",
      spanish: "Español",
      english: "Inglés",
    },
    actions: {
      cancel: "Cancelar",
      close: "Cerrar",
      confirm: "Confirmar",
      changeScreen: "cambiar pantalla",
      showRanking: "mostrar ranking",
      reset: "Reiniciar",
    },
    status: {
      loading: "Cargando…",
    },
  },
  ranking: {
    common: {
      title: "Ranking",
    },
    navigation: {
      scores: "Puntajes",
      ranking: "Ranking",
    },
    reveal: {
      revealing: "Revelando ranking…",
      visible: "Ranking visible",
      hidden: "Ranking oculto — mostrar cuando esté listo",
      instantView: "Vista rápida",
      show: "Mostrar ranking",
      showAll: "Mostrar todo",
      hide: "Ocultar ranking",
    },
    settings: {
      competitionName: "Nombre de la competencia",
      showName: "Mostrar nombre",
    },
    scoreEntry: {
      title: "Ingreso de puntajes",
      team: "equipo",
      teams: "equipos",
      round: "ronda",
      rounds: "rondas",
      searchTeams: "Buscar equipos…",
      addTeamPlaceholder: "Nombre del nuevo equipo",
      addTeam: "Añadir equipo",
      addRound: "Añadir ronda",
    },
    table: {
      team: "Equipo",
      total: "Total",
      unnamedRound: "Ronda sin nombre",
      deleteTeam: "Eliminar equipo",
      deleteRound: "Eliminar ronda",
      noTeamsYet: "Todavía no hay equipos. Agrega el primer equipo para comenzar.",
      noTeamsMatch: "No se encontraron equipos que coincidan con la búsqueda.",
    },
    dialogs: {
      deleteTeamTitle: "¿Eliminar equipo?",
      deleteTeamDesc: "Se eliminará \"{0}\" y todos sus puntajes. Esta acción no se puede deshacer.",
      deleteTeamConfirm: "Eliminar equipo",
      deleteRoundTitle: "¿Eliminar ronda?",
      deleteRoundDesc: "Se eliminará \"{0}\" y todos los puntajes asociados a esta ronda. Esta acción no se puede deshacer.",
      deleteRoundConfirm: "Eliminar ronda",
    },
  },
} as const;

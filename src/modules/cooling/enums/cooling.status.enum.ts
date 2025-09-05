export enum CoolingStatus {
  NOT_STARTED = 'NOT_STARTED', // Processus de refroidissement pas encore commencé
  IN_PROGRESS = 'IN_PROGRESS', // Processus de refroidissement en cours
  FINISHED = 'FINISHED', // Processus de refroidissement terminé
}

export enum CoolingCorrectiveActionType {
  NO_ACTION = 'NO_ACTION',
  CONSUMPTION_IN_HOUR = 'CONSUMPTION_IN_HOUR', // Consommation dans l'heure
  MERCHANDISE_DISCARDED = 'MERCHANDISE_DISCARDED', // Marchandise jetée
}

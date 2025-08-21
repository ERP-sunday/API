export enum TemperatureStatus {
  NORMAL = 'NORMAL', // Pastille noire - Au moins 2 relevés par frigo
  MISSING = 'MISSING', // Pas de pastille - Moins de 2 relevés pour tous les frigos
  WARNING = 'WARNING', // Pastille orange - Une anomalie dans la journée
  CRITICAL = 'CRITICAL', // Pastille rouge - Plus d'une anomalie dans la journée
}

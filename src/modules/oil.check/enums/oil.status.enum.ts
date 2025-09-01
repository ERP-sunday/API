export enum OilStatus {
  NORMAL = 'NORMAL',       // Tous les contrôles effectués, pas d'anomalies
  WARNING = 'WARNING',     // Une anomalie détectée
  CRITICAL = 'CRITICAL',   // Plusieurs anomalies détectées
  MISSING = 'MISSING',     // Contrôles manquants ou incomplets
}

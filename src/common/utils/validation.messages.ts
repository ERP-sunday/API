export const ValidationMessages = {
  REQUIRED: 'Ce champ est requis',
  STRING: 'Ce champ doit être une chaîne de caractères',
  NUMBER: 'Ce champ doit être un nombre',
  DATE: 'Ce champ doit être une date ISO valide (yyyy-mm-dd)',
  MAX_LENGTH: (max: number) =>
    `Ce champ ne doit pas dépasser ${max} caractères`,
  ENUM: 'Valeur invalide',
  MONGO_ID: 'ID invalide',
  EMAIL: 'Ce champ doit être une adresse e-mail valide',
};

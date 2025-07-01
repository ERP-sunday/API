export enum ColdStorageType {
  POSITIVE_CHAMBER = 'enceinte_positive', // Enceinte positive
  NEGATIVE_CHAMBER = 'enceinte_negative', // Enceinte négative
  SHOWCASE = 'vitrine', // Vitrine
  FRUITS_AND_VEGETABLES_CHAMBER = 'enceinte_fruits_legumes', // Enceinte fruits et légumes
  SENSITIVE_POSITIVE_CHAMBER = 'enceinte_sensible_positive', // Enceinte sensible positive
  FINISHED_PRODUCTS_CHAMBER = 'enceinte_produit_fini', // Enceinte produit fini
  MEAT_CARCASS_CHAMBER = 'carcasse_viande', // Carcasse de viande
  DAIRY_PRODUCTS_CHAMBER = 'enceinte_produit_laitier', // Enceinte produit laitier
  REFRIGERATED_ZONE = 'zone_refrigeree', // Zone réfrigérée
}

export interface ColdStorageTemperatureRange {
  min: number; // Température minimale en °C
  max: number; // Température maximale en °C
}

export const ColdStorageTemperatureRanges: Record<ColdStorageType, ColdStorageTemperatureRange> = {
  [ColdStorageType.POSITIVE_CHAMBER]: { min: 0, max: 4.5 },
  [ColdStorageType.NEGATIVE_CHAMBER]: { min: -24, max: -16 },
  [ColdStorageType.SHOWCASE]: { min: 0, max: 6.5 },
  [ColdStorageType.FRUITS_AND_VEGETABLES_CHAMBER]: { min: 0, max: 10 },
  [ColdStorageType.SENSITIVE_POSITIVE_CHAMBER]: { min: 0, max: 2 },
  [ColdStorageType.FINISHED_PRODUCTS_CHAMBER]: { min: 0, max: 3 },
  [ColdStorageType.MEAT_CARCASS_CHAMBER]: { min: 0, max: 7 },
  [ColdStorageType.DAIRY_PRODUCTS_CHAMBER]: { min: 0, max: 8 },
  [ColdStorageType.REFRIGERATED_ZONE]: { min: -100, max: 12 }, // -100 pour signifier "en dessous de 12"
};

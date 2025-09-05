import { PartialType, PickType } from '@nestjs/mapped-types';
import { CoolingDTO } from './cooling.dto';

// Seuls les champs permettant une modification manuelle
export class CoolingPatchDTO extends PartialType(
  PickType(CoolingDTO, ['name'] as const)
) {}

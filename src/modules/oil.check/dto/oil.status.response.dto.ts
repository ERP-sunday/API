import { ApiProperty } from '@nestjs/swagger';
import { OilStatus } from '../enums/oil.status.enum';

export class OilStatusResponseDTO {
  @ApiProperty({
    description: 'Date du contrôle',
    example: '2024-03-20',
    type: String,
  })
  date: string;

  @ApiProperty({
    description: 'Statut des contrôles d\'huile pour la journée',
    enum: OilStatus,
    example: OilStatus.NORMAL,
  })
  status: OilStatus;

  @ApiProperty({
    description: 'Nombre total d\'anomalies détectées dans la journée',
    example: 0,
    type: Number,
  })
  anomalyCount: number;

  @ApiProperty({
    description: 'Nombre de friteuses avec contrôle effectué',
    example: 5,
    type: Number,
  })
  completedFryersCount: number;

  @ApiProperty({
    description: 'Nombre total de friteuses',
    example: 5,
    type: Number,
  })
  totalFryersCount: number;
}

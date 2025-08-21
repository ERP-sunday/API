import { ApiProperty } from '@nestjs/swagger';
import { TemperatureStatus } from '../enums/temperature.status.enum';

export class TemperatureStatusResponseDTO {
  @ApiProperty({
    description: 'Date du relevé',
    example: '2024-03-20',
    type: String,
  })
  date: string;

  @ApiProperty({
    description: 'Statut des relevés de température pour la journée',
    enum: TemperatureStatus,
    example: TemperatureStatus.NORMAL,
  })
  status: TemperatureStatus;

  @ApiProperty({
    description: "Nombre total d'anomalies détectées dans la journée",
    example: 0,
    type: Number,
  })
  anomalyCount: number;

  @ApiProperty({
    description: 'Nombre de frigos avec au moins 2 relevés',
    example: 5,
    type: Number,
  })
  completedStoragesCount: number;

  @ApiProperty({
    description: 'Nombre total de frigos',
    example: 5,
    type: Number,
  })
  totalStoragesCount: number;
}

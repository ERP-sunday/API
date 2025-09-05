import { Injectable } from '@nestjs/common';
import { CoolingDTO } from '../dto/cooling.dto';
import { CoolingPatchDTO } from '../dto/cooling.patch.dto';
import { CoolingFinishDTO } from '../dto/cooling.finish.dto';
import { Cooling } from '../models/cooling.model';
import { CoolingRepository } from '../repositories/cooling.repository';
import { BaseService } from '../../../common/services/base.service';
import { CoolingStatus, CoolingCorrectiveActionType } from '../enums/cooling.status.enum';
import { DateUTCUtils } from '../../../common/utils/date.utc.utils';

@Injectable()
export class CoolingService extends BaseService {
  constructor(private readonly coolingRepository: CoolingRepository) {
    super();
  }

  async getAllCoolings(): Promise<Cooling[]> {
    try {
      return await this.coolingRepository.findAll();
    } catch (error) {
      this.handleError(error);
    }
  }

  async getCoolingById(coolingId: string): Promise<Cooling> {
    try {
      const cooling = await this.coolingRepository.findOneById(coolingId);
      return this.assertFound(cooling, `Cooling ${coolingId} not found`);
    } catch (error) {
      this.handleError(error);
    }
  }

  async createCooling(parameters: CoolingDTO): Promise<Cooling> {
    try {
      // Validation de la température initiale
      if (parameters.initialTemperature < 63 || parameters.initialTemperature > 70) {
        throw new Error(`La température initiale doit être entre 63 et 70°C. Température fournie: ${parameters.initialTemperature}°C`);
      }

      const created = await this.coolingRepository.insert({
        name: parameters.name,
        initialTemperature: parameters.initialTemperature,
        finalTemperature: parameters.finalTemperature,
        // Date actuelle précise pour le début du processus
        initialDate: parameters.initialDate,
        finalDate: parameters.finalDate,
        status: CoolingStatus.IN_PROGRESS, // Le processus démarre automatiquement à la création
        correctiveAction: parameters.correctiveAction || CoolingCorrectiveActionType.NO_ACTION,
      });
      return await this.coolingRepository.findOneById(
        (created as any)._id.toString(),
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateCooling(coolingId: string, coolingDto: CoolingPatchDTO): Promise<Cooling> {
    try {
      const isUpdated = await this.coolingRepository.updateOneBy(
        { _id: coolingId },
        coolingDto,
      );

      this.assertFound(isUpdated, `Cooling ${coolingId} not found`);

      return await this.getCoolingById(coolingId);
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteCooling(coolingId: string): Promise<void> {
    try {
      const isDeleted = await this.coolingRepository.deleteOneBy({
        _id: coolingId,
      });
      this.assertFound(isDeleted, `Cooling ${coolingId} not found`);
    } catch (error) {
      this.handleError(error);
    }
  }

  async finishCooling(coolingId: string, finishDto: CoolingFinishDTO): Promise<Cooling> {
    try {
      const cooling = await this.getCoolingById(coolingId);
      
      // Utiliser les valeurs fournies ou les valeurs par défaut
      const finalDate = finishDto.finalDate ?? DateUTCUtils.getCurrentDateUTC();
      const name = finishDto.name ?? cooling.name;
      
      // Mise à jour avec tous les champs modifiables
      const updateData: any = { 
        status: CoolingStatus.FINISHED,
        name,
        finalDate
      };

      updateData.finalTemperature = finishDto.finalTemperature;
      updateData.correctiveAction = finishDto.correctiveAction;

      const isUpdated = await this.coolingRepository.updateOneBy(
        { _id: coolingId },
        updateData
      );

      this.assertFound(isUpdated, `Cooling ${coolingId} not found`);
      return await this.getCoolingById(coolingId);
    } catch (error) {
      this.handleError(error);
    }
  }
}
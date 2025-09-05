import { Injectable } from '@nestjs/common';
import { CoolingDTO } from '../dto/cooling.dto';
import { CoolingPatchDTO } from '../dto/cooling.patch.dto';
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

  async finishCooling(coolingId: string, finalTemperature: number): Promise<Cooling> {
    try {
      const cooling = await this.getCoolingById(coolingId);
      // Date de finalisation en UTC
      const finalDate = DateUTCUtils.getCurrentDateUTC(); // Date actuelle précise pour le calcul de durée
      
      // Calculer l'action corrective nécessaire selon les conditions d'alerte
      const correctiveAction = this.calculateCorrectiveAction(
        cooling.initialTemperature,
        finalTemperature,
        cooling.initialDate,
        finalDate
      );

      // Mise à jour directe des champs automatiques (pas via updateCooling qui ne permet que name)
      const isUpdated = await this.coolingRepository.updateOneBy(
        { _id: coolingId },
        { 
          status: CoolingStatus.FINISHED,
          finalTemperature,
          finalDate,
          correctiveAction
        }
      );

      this.assertFound(isUpdated, `Cooling ${coolingId} not found`);
      return await this.getCoolingById(coolingId);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Nouvelle méthode pour calculer l'action corrective selon les conditions d'alerte
  private calculateCorrectiveAction(
    initialTemp: number,
    finalTemp: number,
    initialDate: Date,
    finalDate: Date
  ): CoolingCorrectiveActionType {
    // Calculer la durée en heures
    const durationInHours = (finalDate.getTime() - initialDate.getTime()) / (1000 * 60 * 60);
    
    // Conditions d'alerte :
    // - température départ en dessous 63 degrés
    // - température fin au dessus 10 degrés
    // - Délai de 2 heures dépassé
    const hasAlert = initialTemp < 63 || finalTemp > 10 || durationInHours > 2;
    
    if (!hasAlert) {
      return CoolingCorrectiveActionType.NO_ACTION;
    }
    
    // Si alerte mais conditions pas trop critiques → consommation dans l'heure
    // Si conditions très critiques → marchandise jetée
    const isCritical = (initialTemp < 60 || finalTemp > 15 || durationInHours > 4);
    
    return isCritical 
      ? CoolingCorrectiveActionType.MERCHANDISE_DISCARDED
      : CoolingCorrectiveActionType.CONSUMPTION_IN_HOUR;
  }

  // Méthode pour vérifier si une alerte est nécessaire
  async checkCoolingAlert(coolingId: string): Promise<{
    hasAlert: boolean;
    reasons: string[];
    suggestedAction: CoolingCorrectiveActionType;
  }> {
    try {
      const cooling = await this.getCoolingById(coolingId);
      const reasons: string[] = [];
      
      if (cooling.initialTemperature < 63) {
        reasons.push('Température de départ insuffisante (< 63°C)');
      }
      
      if (cooling.finalTemperature && cooling.finalTemperature > 10) {
        reasons.push('Température finale trop élevée (> 10°C)');
      }
      
      if (cooling.finalDate) {
        const durationInHours = (cooling.finalDate.getTime() - cooling.initialDate.getTime()) / (1000 * 60 * 60);
        if (durationInHours > 2) {
          reasons.push('Délai de refroidissement dépassé (> 2 heures)');
        }
      }
      
      const hasAlert = reasons.length > 0;
      const suggestedAction = hasAlert 
        ? this.calculateCorrectiveAction(
            cooling.initialTemperature,
            cooling.finalTemperature || 0,
            cooling.initialDate,
            cooling.finalDate || DateUTCUtils.getCurrentDateUTC() // Date actuelle pour calcul si pas de finalDate
          )
        : CoolingCorrectiveActionType.NO_ACTION;
      
      return { hasAlert, reasons, suggestedAction };
    } catch (error) {
      this.handleError(error);
    }
  }
}
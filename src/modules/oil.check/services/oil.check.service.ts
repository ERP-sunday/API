import { Injectable } from '@nestjs/common';
import {
  OilCheck,
  OilTestMethod,
  OilCorrectiveActionType,
  OilActionToDoType,
} from '../models/oil.check.model';
import { OilCheckDTO } from '../dto/oil.check.dto';
import { OilCheckRepository } from '../repositories/oil.check.repository';
import { FryerRepository } from '../../fryer/repositories/fryer.repository';
import { Types } from 'mongoose';
import { BaseService } from '../../../common/services/base.service';
import { DateRangeFilter } from '../../../common/filters/date.range.filter';
import { OilCheckPatchDTO } from '../dto/oil.check.patch.dto';
import { OilStatus } from '../enums/oil.status.enum';
import { OilStatusResponseDTO } from '../dto/oil.status.response.dto';

@Injectable()
export class OilCheckService extends BaseService {
  constructor(
    private readonly oilCheckRepository: OilCheckRepository,
    private readonly fryerRepository: FryerRepository,
  ) {
    super();
  }

  async getAllOilChecks(filter: DateRangeFilter) {
    try {
      // Créer les dates de début et fin en UTC
      const startDate = new Date(
        Date.UTC(filter.year, filter.month - 1, filter.day),
      );
      const endDate = new Date(
        Date.UTC(filter.year, filter.month - 1, filter.day, 23, 59, 59, 999),
      );

      const mongoFilter = {
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      };

      // Appels en parallèle
      const [fryers, oilChecks] = await Promise.all([
        this.fryerRepository.findAll(),
        this.oilCheckRepository.findManyBy(mongoFilter, {
          populate: [{ path: 'fryer' }],
        }),
      ]);

      // Associer chaque fryer à son contrôle d'huile (ou objet vide mais conforme au modèle)
      return fryers.map((fryer) => {
        const check = oilChecks.find(
          (c) => c.fryer && c.fryer._id.toString() === fryer._id.toString(),
        );
        if (check) {
          const { fryer: fryerData, ...rest } = check;
          return { ...rest, fryer: fryerData };
        } else {
          return {
            _id: null,
            fryer: fryer,
            date: startDate,
            testMethod: OilTestMethod.NO_TEST,
            actionToDo: OilActionToDoType.NO_ACTION,
            correctiveAction: OilCorrectiveActionType.NO_ACTION,
            polarPercentage: null,
          };
        }
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async getOilCheckById(oilCheckId: string): Promise<OilCheck> {
    try {
      const oilCheck = await this.oilCheckRepository.findOneById(oilCheckId, {
        populate: [{ path: 'fryer' }],
      });

      return this.assertFound(oilCheck, `OilCheck ${oilCheckId} not found`);
    } catch (error) {
      this.handleError(error);
    }
  }

  async createOilCheck(dto: OilCheckDTO): Promise<OilCheck> {
    try {
      const {
        fryerId,
        testMethod,
        actionToDo,
        correctiveAction,
        polarPercentage,
      } = dto;

      const saved = await this.oilCheckRepository.insert({
        fryer: new Types.ObjectId(fryerId),
        testMethod,
        actionToDo,
        correctiveAction,
        date: new Date(dto.date),
        polarPercentage,
      });

      const savedData = saved as any;

      return await this.oilCheckRepository.findOneById(
        savedData._id.toString(),
        {
          populate: [{ path: 'fryer' }],
        },
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateOilCheck(id: string, dto: OilCheckPatchDTO): Promise<OilCheck> {
    try {
      const updatePayload: Partial<OilCheck> = {
        ...dto,
        date: new Date(dto.date),
        fryer: new Types.ObjectId(dto.fryerId),
      };

      const isUpdated = await this.oilCheckRepository.updateOneBy(
        { _id: id },
        updatePayload,
      );
      this.assertFound(isUpdated, `OilCheck ${id} not found`);

      return await this.getOilCheckById(id);
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteOilCheck(id: string): Promise<void> {
    try {
      const isDeleted = await this.oilCheckRepository.deleteOneBy({ _id: id });
      this.assertFound(isDeleted, `OilCheck ${id} not found`);
    } catch (error) {
      this.handleError(error);
    }
  }

  async getOilStatusRange(
    startDate?: string,
    endDate?: string,
  ): Promise<OilStatusResponseDTO[]> {
    try {
      let start: Date;
      let end: Date;

      if (startDate && endDate) {
        // Si les deux dates sont fournies, on les utilise
        const [startYear, startMonth, startDay] = startDate
          .split('-')
          .map(Number);
        const [endYear, endMonth, endDay] = endDate.split('-').map(Number);

        start = new Date(Date.UTC(startYear, startMonth - 1, startDay));
        end = new Date(
          Date.UTC(endYear, endMonth - 1, endDay, 23, 59, 59, 999),
        );
      } else if (startDate) {
        // Si seulement la date de début est fournie, on prend jusqu'à aujourd'hui
        const [startYear, startMonth, startDay] = startDate
          .split('-')
          .map(Number);
        start = new Date(Date.UTC(startYear, startMonth - 1, startDay));
        end = new Date();
        end.setUTCHours(23, 59, 59, 999);
      } else if (endDate) {
        // Si seulement la date de fin est fournie, on prend le dernier mois
        const [endYear, endMonth, endDay] = endDate.split('-').map(Number);
        end = new Date(
          Date.UTC(endYear, endMonth - 1, endDay, 23, 59, 59, 999),
        );
        start = new Date(end);
        start.setUTCMonth(start.getUTCMonth() - 1);
        start.setUTCHours(0, 0, 0, 0);
      } else {
        // Si aucune date n'est fournie, on prend le mois en cours
        end = new Date();
        end.setUTCHours(23, 59, 59, 999);
        start = new Date(end);
        start.setUTCDate(1);
        start.setUTCHours(0, 0, 0, 0);
      }

      const mongoFilter = {
        date: {
          $gte: start,
          $lte: end,
        },
      };

      // Appels en parallèle pour optimiser les performances
      const [fryers, oilChecks] = await Promise.all([
        this.fryerRepository.findAll(),
        this.oilCheckRepository.findManyBy(mongoFilter),
      ]);

      const totalFryersCount = fryers.length;
      const statusMap = new Map<string, OilStatusResponseDTO>();

      // Initialiser le Map avec toutes les dates de la plage
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        statusMap.set(dateStr, {
          date: dateStr,
          status: OilStatus.MISSING,
          anomalyCount: 0,
          completedFryersCount: 0,
          totalFryersCount,
        });
      }

      // Analyser chaque contrôle d'huile
      for (const oilCheck of oilChecks) {
        const dateStr = oilCheck.date.toISOString().split('T')[0];
        const currentStatus = statusMap.get(dateStr);

        if (!currentStatus) continue; // Ignorer les dates hors plage

        // Déterminer si ce contrôle présente une anomalie
        let hasAnomaly = false;

        // Anomalie 1: Pourcentage polaire trop élevé (> 24%)
        if (
          oilCheck.testMethod === OilTestMethod.DIGITAL_TESTER &&
          oilCheck.polarPercentage !== null &&
          oilCheck.polarPercentage > 24
        ) {
          hasAnomaly = true;
        }

        // Anomalie 2: Action corrective nécessaire
        if (oilCheck.correctiveAction === OilCorrectiveActionType.CHANGE_OIL) {
          hasAnomaly = true;
        }

        if (hasAnomaly) {
          currentStatus.anomalyCount++;
        }

        // Vérifier si cette friteuse a un contrôle effectué (pas NO_TEST)
        if (oilCheck.id !== null) {
          currentStatus.completedFryersCount++;
        }

        // Mettre à jour le statut selon les règles
        // Si il y a des anomalies, elles prennent priorité
        if (currentStatus.anomalyCount > 1) {
          currentStatus.status = OilStatus.CRITICAL;
        } else if (currentStatus.anomalyCount === 1) {
          currentStatus.status = OilStatus.WARNING;
        } else if (currentStatus.completedFryersCount === totalFryersCount) {
          // Pas d'anomalies et toutes les friteuses ont leurs contrôles
          currentStatus.status = OilStatus.NORMAL;
        } else {
          // Pas d'anomalies mais contrôles incomplets
          currentStatus.status = OilStatus.MISSING;
        }
      }

      // Convertir le Map en tableau et trier par date
      return Array.from(statusMap.values()).sort((a, b) =>
        a.date.localeCompare(b.date),
      );
    } catch (error) {
      this.handleError(error);
    }
  }
}

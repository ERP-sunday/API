import { Injectable } from '@nestjs/common';
import { OilCheck, OilTestMethod, OilCorrectiveActionType, OilActionToDoType } from '../models/oil.check.model';
import { OilCheckDTO } from '../dto/oil.check.dto';
import { OilCheckRepository } from '../repositories/oil.check.repository';
import { FryerRepository } from '../../fryer/repositories/fryer.repository';
import { Types } from 'mongoose';
import { BaseService } from '../../../common/services/base.service';
import { DateRangeFilter } from '../../../common/filters/date.range.filter';
import { OilCheckPatchDTO } from '../dto/oil.check.patch.dto';

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
      const startDate = new Date(Date.UTC(filter.year, filter.month - 1, filter.day));
      const endDate = new Date(Date.UTC(filter.year, filter.month - 1, filter.day, 23, 59, 59, 999));

      const mongoFilter = {
        date: {
          $gte: startDate,
          $lte: endDate
        }
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
          (c) => c.fryer && c.fryer._id.toString() === fryer._id.toString()
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
      const { fryerId, testMethod, actionToDo, correctiveAction, polarPercentage } = dto;

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
}

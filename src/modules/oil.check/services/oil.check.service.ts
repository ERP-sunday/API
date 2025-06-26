import { Injectable } from '@nestjs/common';
import { OilCheck } from '../models/oil.check.model';
import { OilCheckDTO } from '../dto/oil.check.dto';
import { OilCheckRepository } from '../repositories/oil.check.repository';
import { Types } from 'mongoose';
import { BaseService } from '../../../common/services/base.service';
import { DateRangeFilter } from '../../../common/filters/date.range.filter';
import { OilCheckPatchDTO } from '../dto/oil.check.patch.dto';

@Injectable()
export class OilCheckService extends BaseService {
  constructor(private readonly oilCheckRepository: OilCheckRepository) {
    super();
  }

  async getAllOilChecks(filter: DateRangeFilter): Promise<OilCheck[]> {
    try {
      const mongoFilter = filter.toDateFilter();
      return await this.oilCheckRepository.findManyBy(mongoFilter, {
        populate: [{ path: 'fryer' }],
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
      const { fryerId, testMethod, polarPercentage } = dto;

      const saved = await this.oilCheckRepository.insert({
        fryer: new Types.ObjectId(fryerId),
        testMethod,
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

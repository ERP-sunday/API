import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import {OilCheck} from "../models/oil.check.model";
import {OilCheckDTO} from "../dto/oil.check.dto";
import {OilCheckRepository} from "../repositories/oil.check.repository";
import {Types} from "mongoose";

@Injectable()
export class OilCheckService {
    constructor(private readonly oilCheckRepository: OilCheckRepository) {}

    async getAllOilChecks(day?: number, month?: number, year?: number): Promise<OilCheck[]> {
        try {
            const filter: any = {};

            if (year !== undefined) {
                if (isNaN(year) || year < 1970) {
                    throw new BadRequestException('Invalid year format');
                }

                if (month !== undefined && day !== undefined) {
                    if (isNaN(month) || isNaN(day) || month < 1 || month > 12 || day < 1 || day > 31) {
                        throw new BadRequestException('Invalid day or month format');
                    }

                    const startDate = new Date(year, month - 1, day, 0, 0, 0);
                    const endDate = new Date(year, month - 1, day, 23, 59, 59, 999);
                    filter.date = { $gte: startDate, $lte: endDate };

                } else if (month !== undefined) {
                    if (isNaN(month) || month < 1 || month > 12) {
                        throw new BadRequestException('Invalid month format');
                    }

                    const startDate = new Date(year, month - 1, 1);
                    const endDate = new Date(year, month, 0, 23, 59, 59, 999);
                    filter.date = { $gte: startDate, $lte: endDate };

                } else {
                    const startDate = new Date(year, 0, 1);
                    const endDate = new Date(year, 11, 31, 23, 59, 59, 999);
                    filter.date = { $gte: startDate, $lte: endDate };
                }
            }

            return await this.oilCheckRepository.findManyBy(filter, {
                populate: [{ path: 'fryer' }],
            });
        } catch (error) {
            throw new InternalServerErrorException(error.message || 'Something went wrong');
        }
    }

    async getOilCheckById(oilCheckId: string): Promise<OilCheck> {
        try {
            const oilCheck = await this.oilCheckRepository.findOneById(oilCheckId, {
                populate: [{ path: 'fryer' }],
            });
            if (!oilCheck) throw new NotFoundException();
            return oilCheck;
        } catch {
            throw new NotFoundException();
        }
    }

    async createOilCheck(dto: OilCheckDTO): Promise<OilCheck> {
        try {
            const { fryerId, testMethod, date, polarPercentage } = dto;

            const saved = await this.oilCheckRepository.insert({
                fryer: new Types.ObjectId(fryerId),
                testMethod,
                date,
                polarPercentage
            });

            return await this.oilCheckRepository.findOneById(saved._id, { populate: [{ path: "fryer" }] });
        } catch {
            throw new BadRequestException();
        }
    }

    async updateOilCheck(id: string, dto: OilCheckDTO): Promise<OilCheck> {
        const updatePayload: Partial<OilCheck> = {
            ...dto,
            fryer: new Types.ObjectId(dto.fryerId),
        };

        const isUpdated = await this.oilCheckRepository.updateOneBy(
            { _id: id },
            updatePayload,
        );

        if (!isUpdated) {
            throw new NotFoundException();
        }

        return await this.getOilCheckById(id);
    }

    async deleteOilCheck(id: string): Promise<void> {
        const isDeleted = await this.oilCheckRepository.deleteOneBy({ _id: id });

        if (!isDeleted) {
            throw new NotFoundException();
        }
    }
}
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

    async getAllOilChecks(): Promise<OilCheck[]> {
        try {
            return await this.oilCheckRepository.findAll( {
                populate: [{ path: 'fryer' }],
            });
        } catch {
            throw new InternalServerErrorException();
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
import {BadRequestException} from "@nestjs/common";

export class DateRangeFilter {
    day?: number;
    month?: number;
    year?: number;

    constructor(partial?: Partial<DateRangeFilter>) {
        if (partial) {
            if (partial.year !== undefined) this.year = Number(partial.year);
            if (partial.month !== undefined) this.month = Number(partial.month);
            if (partial.day !== undefined) this.day = Number(partial.day);
        }
    }

    toDateFilter(): Record<string, any> | undefined {
        if (this.year === undefined) return;

        const { year, month, day } = this;

        if (isNaN(year) || year < 1970) throw new BadRequestException('Invalid year format');

        if (month !== undefined && day !== undefined) {
            if (isNaN(month) || isNaN(day) || month < 1 || month > 12 || day < 1 || day > 31) {
                throw new BadRequestException('Invalid day or month format');
            }
            const start = new Date(year, month - 1, day, 0, 0, 0);
            const end = new Date(year, month - 1, day, 23, 59, 59, 999);
            return { date: { $gte: start, $lte: end } };
        }

        if (month !== undefined) {
            if (isNaN(month) || month < 1 || month > 12) {
                throw new BadRequestException('Invalid month format');
            }
            const start = new Date(year, month - 1, 1);
            const end = new Date(year, month, 0, 23, 59, 59, 999);
            return { date: { $gte: start, $lte: end } };
        }

        const start = new Date(year, 0, 1);
        const end = new Date(year, 11, 31, 23, 59, 59, 999);
        return { date: { $gte: start, $lte: end } };
    }
}
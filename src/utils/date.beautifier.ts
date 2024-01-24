import * as moment from 'moment';

export class DateBeautifier {
    static shared: DateBeautifier = new DateBeautifier()

    getFullDate(): string {
        return moment().format('YYYY-MM-DD HH:mm:ss');
    }
}
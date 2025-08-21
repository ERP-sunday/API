import * as moment from 'moment';
import { Schema } from 'mongoose';

export default class DateBeautifier {
  static getFullDate(): string {
    return moment().format('YYYY-MM-DD HH:mm:ss');
  }

  static shared = new DateBeautifier();

  getFullDate(): string {
    return DateBeautifier.getFullDate();
  }
}

export function addDateTrackingHooks(schema: Schema) {
  schema.pre(['updateOne', 'findOneAndUpdate'], function (next) {
    this.set({ dateLastModified: DateBeautifier.getFullDate() });
    next();
  });
}

import { DateRangeFilter } from '../filters/date.range.filter';

/**
 * Utilitaire pour la gestion centralisée des dates en UTC
 * Évite la duplication de code et garantit la cohérence
 */
export class DateUTCUtils {
  /**
   * Convertit une date (string ou Date) au début du jour en UTC (00:00:00.000)
   * @param date - Date à convertir (string ISO ou objet Date)
   * @returns Date UTC au début du jour
   */
  static toStartOfDayUTC(date: string | Date): Date {
    const localDate = new Date(date);
    return new Date(
      Date.UTC(
        localDate.getFullYear(),
        localDate.getMonth(),
        localDate.getDate(),
        0,
        0,
        0,
        0,
      ),
    );
  }

  /**
   * Convertit une date (string ou Date) à la fin du jour en UTC (23:59:59.999)
   * @param date - Date à convertir (string ISO ou objet Date)
   * @returns Date UTC à la fin du jour
   */
  static toEndOfDayUTC(date: string | Date): Date {
    const localDate = new Date(date);
    return new Date(
      Date.UTC(
        localDate.getFullYear(),
        localDate.getMonth(),
        localDate.getDate(),
        23,
        59,
        59,
        999,
      ),
    );
  }

  /**
   * Crée une plage de dates UTC (début et fin) à partir d'un filtre DateRangeFilter
   * @param filter - Filtre contenant année, mois, jour
   * @returns Objet avec startDate et endDate en UTC
   */
  static createDayRangeUTC(filter: DateRangeFilter): {
    startDate: Date;
    endDate: Date;
  } {
    const startDate = new Date(
      Date.UTC(filter.year, filter.month - 1, filter.day),
    );
    const endDate = new Date(
      Date.UTC(filter.year, filter.month - 1, filter.day, 23, 59, 59, 999),
    );

    return { startDate, endDate };
  }

  /**
   * Parse une date string au format YYYY-MM-DD en début de jour UTC
   * @param dateString - Date au format YYYY-MM-DD
   * @returns Date UTC au début du jour
   */
  static parseStringToStartOfDayUTC(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  }

  /**
   * Parse une date string au format YYYY-MM-DD en fin de jour UTC
   * @param dateString - Date au format YYYY-MM-DD
   * @returns Date UTC à la fin du jour
   */
  static parseStringToEndOfDayUTC(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
  }

  /**
   * Crée une plage de dates flexible selon les paramètres fournis
   * @param startDate - Date de début optionnelle (format YYYY-MM-DD)
   * @param endDate - Date de fin optionnelle (format YYYY-MM-DD)
   * @returns Objet avec start et end en UTC
   */
  static createFlexibleDateRange(
    startDate?: string,
    endDate?: string,
  ): { start: Date; end: Date } {
    let start: Date;
    let end: Date;

    if (startDate && endDate) {
      // Si les deux dates sont fournies, on les utilise
      start = this.parseStringToStartOfDayUTC(startDate);
      end = this.parseStringToEndOfDayUTC(endDate);
    } else if (startDate) {
      // Si seulement la date de début est fournie, on prend jusqu'à aujourd'hui
      start = this.parseStringToStartOfDayUTC(startDate);
      end = new Date();
      end.setUTCHours(23, 59, 59, 999);
    } else if (endDate) {
      // Si seulement la date de fin est fournie, on prend le dernier mois
      end = this.parseStringToEndOfDayUTC(endDate);
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

    return { start, end };
  }

  /**
   * Convertit la date actuelle au début du jour UTC
   * @returns Date actuelle au début du jour en UTC
   */
  static getCurrentStartOfDayUTC(): Date {
    return this.toStartOfDayUTC(new Date());
  }

  /**
   * Convertit la date actuelle à la fin du jour UTC
   * @returns Date actuelle à la fin du jour en UTC
   */
  static getCurrentEndOfDayUTC(): Date {
    return this.toEndOfDayUTC(new Date());
  }

  /**
   * Obtient la date/heure actuelle en UTC
   * @returns Date actuelle avec heure précise en UTC (JavaScript stocke nativement en UTC)
   */
  static getCurrentDateUTC(): Date {
    return new Date();
  }
}

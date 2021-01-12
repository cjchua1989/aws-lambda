import * as moment from 'moment-timezone';
moment.tz.setDefault(process.env.CARBON_TIMEZONE ?? 'Asia/Manila');

export class Carbon {
    static now(): moment.Moment {
        return moment();
    }

    static nowFormatted(): string {
        return moment().format('YYYY-MM-DD HH:mm:ss');
    }

    static yesterday(): moment.Moment {
        return moment().subtract(1, 'day');
    }

    static parse(date: string, format = ''): moment.Moment {
        return moment(date, format);
    }

    static logicDate(): moment.Moment {
        return Carbon.hour() < 4 ? Carbon.yesterday() : Carbon.now();
    }

    static hour(): number {
        return parseInt(Carbon.now().format('H'));
    }

    static unix(timestamp: number): moment.Moment {
        return moment.unix(timestamp);
    }

    static epoch(timestamp: number): moment.Moment {
        return moment.unix(timestamp / 1000);
    }
}

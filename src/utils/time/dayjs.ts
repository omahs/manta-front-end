import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';

dayjs.extend(customParseFormat); // https://day.js.org/docs/en/plugin/custom-parse-format
dayjs.extend(advancedFormat); // https://day.js.org/docs/en/plugin/advanced-format
dayjs.extend(duration); // https://day.js.org/docs/en/plugin/duration
dayjs.extend(utc); // https://day.js.org/docs/en/plugin/utc
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);

export const twoDP = (n: number) => (n > 9 ? n : '0' + n);

export default dayjs;

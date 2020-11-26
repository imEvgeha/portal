import moment from 'moment';

export const DATE_FORMAT = 'YYYY-MM-DD';

export const getValidDate = date => {
    if (date) {
        return moment(date).format(DATE_FORMAT);
    }
    return date;
};

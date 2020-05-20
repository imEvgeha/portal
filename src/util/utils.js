import moment from 'moment';
import {DATE_FORMAT} from '../../legacy/constants/metadata/constant-variables';

export const getValidDate = (date) => {
    if (date) {
        return moment(date).format(DATE_FORMAT);
    }
    return date;
};

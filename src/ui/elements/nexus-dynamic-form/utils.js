import {get} from 'lodash';
import {VIEWS} from './constants';

export const getDefaultValue = (field = {}, view, data) => {
    return view === VIEWS.CREATE ? get(field, 'defaultValueCreate') : get(data, field.path);
};

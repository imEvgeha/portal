import config from 'react-global-configuration';
import {nexusFetch} from '../../../../util/http-client/index';

export const fetchSelectValues = endpoint => {
    const url = `${config.get('gateway.configuration')}/configuration-api/v1${endpoint}?page=0&size=10000`;
    return nexusFetch(url, {isWithErrorHandling: false});
};

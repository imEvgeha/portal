import Http from '../../../../util/Http';
import config from 'react-global-configuration';

const http = Http.create();

export const dashboardService = {
    createTitle: (title) => {
        return http.post(config.get('gateway.titleUrl') + config.get('gateway.service.title') +'/titles', title);
    }
};


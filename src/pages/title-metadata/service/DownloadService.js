import config from 'react-global-configuration';
import {nexusFetch} from '../../../util/http-client';

export const downloadService = {
  downloadMetadata: () => {
      const url = `${
        config.get('gateway.titleUrl') + config.get('gateway.service.title')
    }/editorialmetadata/download?locale=${'IL'}&language=${'he'}&byDopEmtTasks=${false}&emetStatus=${'PENDING'}`;
      const abortAfter = config.get('avails.export.http.timeout');

      return nexusFetch(
          url,
          {
              method: 'post',
          },
          abortAfter
      );
    },
};

import {encodedSerialize, prepareSortMatrixParamTitles} from '../Common';
import {getConfig} from '../config';
import {nexusFetch} from '../http-client';

export const fetchUploadedEMETsLog = async (data, page, size, sortedParams) => {
    const {tenantCode, uploadedBy, uploadedAt, status} = data;
    if (tenantCode) {
        const body = {
            uploadedBy,
            startDate: uploadedAt?.uploadedAtFrom,
            endDate: uploadedAt?.uploadedAtTo,
            status,
        };
        return await getUploadedMetadata(body, tenantCode, page, size, sortedParams);
    }
};

export const downloadUploadedEMETLog = async fileId => {
    if (fileId) {
        return await getUploadLogMetadataFile(fileId);
    }
};

const getUploadedMetadata = async (dataForUploadedMetadata, tenantCode, page, size, sortedParams) => {
    const url = `${getConfig('gateway.titleUrl')}${getConfig(
        'gateway.service.title'
    )}/importLog${prepareSortMatrixParamTitles(sortedParams)}`;
    const params = tenantCode ? {tenantCode} : {};

    return nexusFetch(url, {
        method: 'post',
        body: JSON.stringify(dataForUploadedMetadata),
        params: encodedSerialize({...params, page, size}),
    });
};

const getUploadLogMetadataFile = id => {
    const url = `${getConfig('gateway.titleUrl')}${getConfig('gateway.service.title')}/importReport/${id}`;
    return nexusFetch(url, {
        method: 'get',
    });
};

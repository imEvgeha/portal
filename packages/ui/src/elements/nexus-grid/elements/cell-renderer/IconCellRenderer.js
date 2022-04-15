import React, {useCallback} from 'react';
import loadingGif from '@vubiquity-nexus/portal-assets/img/loading.gif';
import {downloadFile, getDeepValue} from '@vubiquity-nexus/portal-utils/lib/Common';
import {downloadUploadedEMETLog} from '@vubiquity-nexus/portal-utils/lib/services/UploadLogService';
import {debounce} from 'lodash';
import {useDispatch} from 'react-redux';
import {addToast} from '../../../../toast/NexusToastNotificationActions';
import NexusTooltip from '../../../nexus-tooltip/NexusTooltip';
import {getIcon} from '../value-formatter/createValueFormatter';
import './IconCellRenderer.scss';

const IconCellRenderer = params => {
    const dispatch = useDispatch();
    const {
        data,
        colDef: {field},
        valueToDisplay = null,
        icon = '',
        tooltip = '',
    } = params;
    if (!data) {
        return <img src={loadingGif} alt="loadingSpinner" />;
    }

    const value = getDeepValue(data, field);
    const idToFileDownloading = data.reportId;

    const successToast = {
        severity: 'success',
        detail: 'File downloading started',
    };

    const handleClick = useCallback(
        debounce(() => {
            if (idToFileDownloading) {
                dispatch(addToast(successToast));
                downloadUploadedEMETLog(idToFileDownloading)
                    .then(response => {
                        const name = data.sourceFileName.includes('.xlsx')
                            ? data.sourceFileName.replace('.xlsx', '')
                            : data.sourceFileName;
                        downloadFile(response, `${name}_Report_`, '.xlsx', false);
                    })
                    .catch(err => console.error(err));
            }
        }, 1000),
        []
    );

    return (!valueToDisplay && value) || (valueToDisplay && value === valueToDisplay) ? (
        <NexusTooltip content={tooltip}>
            <span
                className={`nexus-c-repository-icon ${
                    params.position === 'center' ? 'nexus-c-repository-icon-position-center' : ''
                }`}
                onClick={handleClick}
            >
                {getIcon(icon, false)}
            </span>
        </NexusTooltip>
    ) : (
        ' '
    );
};
export default IconCellRenderer;

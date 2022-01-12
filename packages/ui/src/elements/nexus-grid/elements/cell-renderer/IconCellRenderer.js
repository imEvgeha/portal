import React, { useCallback } from 'react';
import loadingGif from '@vubiquity-nexus/portal-assets/img/loading.gif';
import NexusTooltip from '@vubiquity-nexus/portal-ui/lib/elements/nexus-tooltip/NexusTooltip';
import {downloadFile, getDeepValue} from '@vubiquity-nexus/portal-utils/lib/Common';
import { debounce } from 'lodash';
import { store } from '../../../../../../../src';
import { downloadUploadedEMETLog } from '../../../../../../../src/pages/title-metadata/service/UploadLogService';
import { SUCCESS_ICON } from '../../../../../lib/elements/nexus-toast-notification/constants';
import { addToast } from '../../../../../lib/toast/toastActions';
import {getIcon} from '../value-formatter/createValueFormatter';
import './IconCellRenderer.scss';

const IconCellRenderer = params => {
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
        title: 'Success',
        icon: SUCCESS_ICON,
        isAutoDismiss: true,
        description: 'File downloading started',
    };

    const handleClick = useCallback(
        debounce(() => {
            if(idToFileDownloading) {
                downloadUploadedEMETLog(idToFileDownloading)
                    .then(response => {
                        const name = data.sourceFileName.includes('.xlsx') ? data.sourceFileName.replace('.xlsx', '') : data.sourceFileName;
                        downloadFile(response, `${name}_Report_`, '.xlsx', false);
                        store.dispatch(addToast(successToast));
                    }) 
                    .catch(err => console.error(err));
            }
        }, 1000),
        []
    );

    return (!valueToDisplay && value) || (valueToDisplay && value === valueToDisplay) ? (
        <NexusTooltip content={tooltip}>
            <span 
                className={`nexus-c-repository-icon ${params.position === 'center' ? 'nexus-c-repository-icon-position-center' : ''}`} 
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

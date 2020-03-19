import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import DownloadIcon from '@atlaskit/icon/glyph/download';
import {alertModal} from '../../../components/modal/AlertModal';
import {confirmModal} from '../../../components/modal/ConfirmModal';
import {CUSTOM_HEADER_LIST} from '../../../constants/customColumnHeaders';
import {exportService} from '../../../containers/avail/service/ExportService';
import {downloadFile} from '../../../util/Common';
import {FATAL} from '../../../constants/avails/manualRightsEntryTabs';
import './TableDownload.scss';

export default function TableDownloadRights({getColumns, getSelected, allowDownloadFullTab, selectedTab, exportCriteria}) {

    const [filteredColumns, setFilteredColumns] = useState([]);

    useEffect(() => {
        if (getColumns()) {
            const filteredColumns = getColumns().filter(el => !CUSTOM_HEADER_LIST.includes(el));
            setFilteredColumns(filteredColumns);
        }
    }, [getColumns()]);

    const noAvailSelectedAlert = () => {
        alertModal.open('Action required', () => {
        }, {description: 'Please select at least one right'});
    };

    const prettyTabName = () => {
        return `${selectedTab[0]}${selectedTab.slice(1).toLowerCase()}`.replace('_', ' ');
    };

    const exportAvails = () => {
        if (selectedTab !== FATAL) {
            if (getSelected().length === 0) {
                if (allowDownloadFullTab) {
                    confirmModal.open('Confirm download',
                        exportAvailsCriteria,
                        () => {
                            //Empty because of design confirmModal. The modal will just close on cancel button press.
                        },
                        {description: `You have select ${prettyTabName()} tab for download.`});
                } else {
                    noAvailSelectedAlert();
                }
            } else {
                confirmModal.open('Confirm download',
                    exportAvailsByIds,
                    () => {
                        //Empty because of design confirmModal. The modal will just close on cancel button press.
                    },
                    {description: `You have selected ${getSelected().length} avails for download.`});
            }
        }
    };

    const exportAvailsByIds = () => {
        exportService.exportAvails(getSelected().map(({id}) => id), filteredColumns)
            .then(function (response) {
                downloadFile(response.data);
            });
    };

    const exportAvailsCriteria = () => {
        exportService.bulkExportAvails(exportCriteria, filteredColumns)
            .then(function (response) {
                downloadFile(response.data);
            });
    };

    return (
        <div className='nexus-download__icon-button' onClick={exportAvails}><DownloadIcon size='large'/></div>
    );
}

TableDownloadRights.propTypes = {
    getColumns: PropTypes.func,
    getSelected: PropTypes.func,
    allowDownloadFullTab: PropTypes.bool,
    selectedTab: PropTypes.string,
    exportCriteria: PropTypes.object,
};

TableDownloadRights.defaultProps = {
    allowDownloadFullTab: false,
    selectedTab: 'None',
    getSelected: () => [],
    exportCriteria: {}
};

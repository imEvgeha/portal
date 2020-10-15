import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import DownloadIcon from '@atlaskit/icon/glyph/download';
import './TableDownload.scss';
import {alertModal} from '../../../pages/legacy/components/modal/AlertModal';
import {confirmModal} from '../../../pages/legacy/components/modal/ConfirmModal';
import {FATAL} from '../../../pages/legacy/constants/avails/manualRightsEntryTabs';
import {CUSTOM_HEADER_LIST} from '../../../pages/legacy/constants/customColumnHeaders';
import {exportService} from '../../../pages/legacy/containers/avail/service/ExportService';
import {downloadFile} from '../../../util/Common';

const TableDownloadRights = ({getColumns, getSelected, allowDownloadFullTab, selectedTab, exportCriteria}) => {
    const [filteredColumns, setFilteredColumns] = useState([]);
    const columns = getColumns();

    useEffect(() => {
        if (columns) {
            const filteredColumns = columns.filter(el => !CUSTOM_HEADER_LIST.includes(el));
            setFilteredColumns(filteredColumns);
        }
    }, [columns]);

    const noAvailSelectedAlert = () => {
        alertModal.open('Action required', () => null, {description: 'Please select at least one right'});
    };

    const prettyTabName = () => {
        return `${selectedTab[0]}${selectedTab.slice(1).toLowerCase()}`.replace('_', ' ');
    };

    const exportAvails = () => {
        if (selectedTab !== FATAL) {
            if (getSelected().length === 0) {
                if (allowDownloadFullTab) {
                    confirmModal.open(
                        'Confirm download',
                        exportAvailsCriteria,
                        () => {
                            // Empty because of design confirmModal. The modal will just close on cancel button press.
                        },
                        {description: `You have select ${prettyTabName()} tab for download.`}
                    );
                } else {
                    noAvailSelectedAlert();
                }
            } else {
                confirmModal.open(
                    'Confirm download',
                    exportAvailsByIds,
                    () => {
                        // Empty because of design confirmModal. The modal will just close on cancel button press.
                    },
                    {description: `You have selected ${getSelected().length} avails for download.`}
                );
            }
        }
    };

    const exportAvailsByIds = () => {
        exportService
            .exportAvails(
                getSelected().map(({id}) => id),
                filteredColumns
            )
            .then(response => {
                downloadFile(response);
            });
    };

    const exportAvailsCriteria = () => {
        exportService.bulkExportAvails(exportCriteria, filteredColumns).then(response => {
            downloadFile(response);
        });
    };

    return (
        <div className="nexus-download__icon-button" onClick={exportAvails}>
            <DownloadIcon size="large" />
        </div>
    );
};

export default TableDownloadRights;

TableDownloadRights.propTypes = {
    getColumns: PropTypes.func,
    getSelected: PropTypes.func,
    // eslint-disable-next-line react/boolean-prop-naming
    allowDownloadFullTab: PropTypes.bool,
    selectedTab: PropTypes.string,
    exportCriteria: PropTypes.object,
};

TableDownloadRights.defaultProps = {
    allowDownloadFullTab: false,
    selectedTab: 'None',
    getSelected: () => [],
    getColumns: () => [],
    exportCriteria: {},
};

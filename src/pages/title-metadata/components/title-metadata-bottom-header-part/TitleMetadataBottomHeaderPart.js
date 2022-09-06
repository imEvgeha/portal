import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {isAllowed} from '@portal/portal-auth/permissions';
import {Button} from '@portal/portal-components';
import CloudDownloadIcon from '@vubiquity-nexus/portal-assets/action-cloud-download.svg';
import CloudUploadIcon from '@vubiquity-nexus/portal-assets/action-cloud-upload.svg';
import NexusUploadButton from '@vubiquity-nexus/portal-ui/lib/elements/nexus-upload-button/NexusUploadButton';
import {getConfig} from '@vubiquity-nexus/portal-utils/lib/config';
import moment from 'moment';
import {connect} from 'react-redux';
import './TitleMetadataBottomHeaderPart.scss';
import SelectedButton from '../../../avails/avails-table-toolbar/components/selected-button/SelectedButton';
import SyncLogDatePicker from '../../../sync-log/components/SyncLogDatePicker/SyncLogDatePicker';
import {createSaveDateFromAction, createSaveDateToAction} from '../../../sync-log/syncLogActions';
import {selectSyncLogDateFrom, selectSyncLogDateTo} from '../../../sync-log/syncLogSelectors';
import {exportSyncLog} from '../../../sync-log/syncLogService';
import {METADATA_UPLOAD_TITLE} from '../../constants';
import CloudDownloadButton from '../title-metadata-header/components/CloudDownloadButton/CloudDownloadButton';

export const TitleMetadataBottomHeaderPart = ({
    isItTheSameTab,
    uploadHandler,
    setDateFrom,
    dateFrom,
    setDateTo,
    dateTo,
    showSuccess,
    selectedTitlesLength,
    showSelected,
    setShowSelected,
    showDeleteModal,
    setShowDeleteModal,
}) => {
    const [dateError, setDateError] = useState(null);
    const isDeletePermitted = () => isAllowed('metadataDelete');

    if (isItTheSameTab('repository')) {
        return (
            <div className="row">
                <div className="col d-flex justify-content-between">
                    <div className="d-flex align-items-center">
                        <div className="nexus-c-title-selected-button-container d-flex justify-content-end">
                            <SelectedButton
                                selectedRightsCount={selectedTitlesLength}
                                setIsSelected={setShowSelected}
                                isSelected={showSelected}
                            />
                        </div>
                        {isDeletePermitted() ? (
                            <>
                                <div className="nexus-c-title-dividing-line" />
                                <Button
                                    className="p-button-text"
                                    onClick={() => setShowDeleteModal(!showDeleteModal)}
                                    disabled={!selectedTitlesLength}
                                    label="Delete"
                                />
                            </>
                        ) : null}
                    </div>
                    <div className="d-flex">
                        <NexusUploadButton
                            title={METADATA_UPLOAD_TITLE}
                            icon={CloudUploadIcon}
                            uploadCallback={uploadHandler}
                            extensionsAccepted={getConfig('avails.upload.extensions')}
                        />
                        <CloudDownloadButton showSuccess={showSuccess} />
                    </div>
                </div>
            </div>
        );
    }

    if (isItTheSameTab('syncLog')) {
        const onDateFromChange = dateFrom => {
            if (moment().isBefore(dateFrom)) {
                setDateError('from');
            } else {
                setDateError(null);
            }
            setDateFrom(dateFrom);
        };
        const onDateToChange = dateTo => {
            if (moment(dateFrom).isAfter(dateTo)) {
                setDateError('to');
            } else {
                setDateError(null);
                setDateTo(dateTo);
            }
        };

        return (
            <div className="row nexus-c-title-date-picker-container">
                <div className="col-4" />
                <div className="col-4 d-flex justify-content-center">
                    <SyncLogDatePicker
                        onDateFromChange={onDateFromChange}
                        onDateToChange={onDateToChange}
                        dateFrom={dateFrom}
                        dateTo={dateTo}
                        dateError={dateError}
                    />
                </div>
                <div className="col-4 d-flex justify-content-end align-items-center">
                    <Button
                        icon={CloudDownloadIcon}
                        className="p-button-text"
                        onClick={() => exportSyncLog(dateFrom, dateTo)}
                        tooltip="Download"
                        tooltipOptions={{position: 'left'}}
                    />
                </div>
            </div>
        );
    }
    return null;
};

TitleMetadataBottomHeaderPart.propTypes = {
    isItTheSameTab: PropTypes.func,
    uploadHandler: PropTypes.func,
    setDateFrom: PropTypes.func.isRequired,
    dateFrom: PropTypes.string.isRequired,
    setDateTo: PropTypes.func.isRequired,
    dateTo: PropTypes.string.isRequired,
    showSuccess: PropTypes.func,
    selectedTitlesLength: PropTypes.number,
    showSelected: PropTypes.bool,
    setShowSelected: PropTypes.func,
    showDeleteModal: PropTypes.bool,
    setShowDeleteModal: PropTypes.func,
};

TitleMetadataBottomHeaderPart.defaultProps = {
    isItTheSameTab: () => null,
    uploadHandler: () => null,
    showSuccess: () => null,
    showSelected: false,
    setShowSelected: () => null,
    selectedTitlesLength: 0,
    showDeleteModal: false,
    setShowDeleteModal: () => null,
};

const mapStateToProps = () => {
    return state => ({
        dateFrom: selectSyncLogDateFrom(state),
        dateTo: selectSyncLogDateTo(state),
    });
};

const mapDispatchToProps = dispatch => ({
    setDateFrom: dateFrom => dispatch(createSaveDateFromAction(dateFrom)),
    setDateTo: dateTo => dispatch(createSaveDateToAction(dateTo)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TitleMetadataBottomHeaderPart);

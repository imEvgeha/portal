import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CloudUploadIcon from '@vubiquity-nexus/portal-assets/action-cloud-upload.svg';
import NexusUploadButton from '@vubiquity-nexus/portal-ui/lib/elements/nexus-upload-button/NexusUploadButton';
import moment from 'moment';
import { Button } from 'primereact/button';
import {connect} from 'react-redux';
import './TitleMetadataBottomHeaderPart.scss';
import SyncLogDatePicker from '../../../sync-log/components/SyncLogDatePicker/SyncLogDatePicker';
import { createSaveDateFromAction, createSaveDateToAction } from '../../../sync-log/syncLogActions';
import { DOWNLOAD_BTN } from '../../../sync-log/syncLogConstants';
import { selectSyncLogDateFrom, selectSyncLogDateTo } from '../../../sync-log/syncLogSelectors';
import { exportSyncLog } from '../../../sync-log/syncLogService';
import { METADATA_UPLOAD_TITLE } from '../../constants';


const TitleMetadataBottomHeaderPart = ({getNameOfCurrentTab, uploadHandler, setDateFrom, dateFrom, setDateTo, dateTo}) => {
  const [dateError, setDateError] = useState(null);

  if(getNameOfCurrentTab() === 'repository'){
      return (<div className="nexus-c-title-metadata__load-container">
          <NexusUploadButton title={METADATA_UPLOAD_TITLE} icon={CloudUploadIcon} uploadCallback={uploadHandler} />
          <NexusUploadButton title={METADATA_UPLOAD_TITLE} icon={CloudUploadIcon} uploadCallback={uploadHandler} />
      </div>)
  }

  if(getNameOfCurrentTab() === 'syncLog') {
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
      <div>
        <SyncLogDatePicker
            onDateFromChange={onDateFromChange}
            onDateToChange={onDateToChange}
            dateFrom={dateFrom}
            dateTo={dateTo}
            dateError={dateError}
        />
        <Button label={DOWNLOAD_BTN} onClick={() => exportSyncLog(dateFrom, dateTo)} />
      </div>
    )
  }
  return null;
}

TitleMetadataBottomHeaderPart.propTypes = {
  getNameOfCurrentTab: PropTypes.func,
  uploadHandler: PropTypes.func,
  setDateFrom: PropTypes.func.isRequired,
  dateFrom: PropTypes.string.isRequired,
  setDateTo: PropTypes.func.isRequired,
  dateTo: PropTypes.string.isRequired,
};

TitleMetadataBottomHeaderPart.defaultProps = {
  getNameOfCurrentTab: () => null,
  uploadHandler: () => null,
};

const mapStateToProps = state => ({
  dateFrom: selectSyncLogDateFrom(state),
  dateTo: selectSyncLogDateTo(state),
});

const mapDispatchToProps = dispatch => ({
  setDateFrom: dateFrom => dispatch(createSaveDateFromAction(dateFrom)),
  setDateTo: dateTo => dispatch(createSaveDateToAction(dateTo)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TitleMetadataBottomHeaderPart);

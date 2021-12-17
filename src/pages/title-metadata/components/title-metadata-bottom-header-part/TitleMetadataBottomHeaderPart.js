import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CloudDownloadIcon from '@vubiquity-nexus/portal-assets/action-cloud-download.svg';
import CloudUploadIcon from '@vubiquity-nexus/portal-assets/action-cloud-upload.svg';
import NexusUploadButton from '@vubiquity-nexus/portal-ui/lib/elements/nexus-upload-button/NexusUploadButton';
import moment from 'moment';
import { Button } from 'primereact/button';
import {connect} from 'react-redux';
import { Col, Row } from 'reactstrap';
import './TitleMetadataBottomHeaderPart.scss';
import SyncLogDatePicker from '../../../sync-log/components/SyncLogDatePicker/SyncLogDatePicker';
import { createSaveDateFromAction, createSaveDateToAction } from '../../../sync-log/syncLogActions';
import { selectSyncLogDateFrom, selectSyncLogDateTo } from '../../../sync-log/syncLogSelectors';
import { exportSyncLog } from '../../../sync-log/syncLogService';
import { METADATA_UPLOAD_TITLE } from '../../constants';
import CloudDownloadButton from '../title-metadata-header/components/CloudDownloadButton/CloudDownloadButton';


const TitleMetadataBottomHeaderPart = ({
  isItTheSameTab,
  uploadHandler,
  setDateFrom,
  dateFrom,
  setDateTo,
  dateTo,
  showSuccess,
  showError
}) => {
  const [dateError, setDateError] = useState(null);

  if(isItTheSameTab('repository')){
      return (
        <Row>
          <Col className="d-flex justify-content-end">
            <NexusUploadButton title={METADATA_UPLOAD_TITLE} icon={CloudUploadIcon} uploadCallback={uploadHandler} />
            <CloudDownloadButton showSuccess={showSuccess} showError={showError} />
          </Col>
        </Row>
      )
  }

  if(isItTheSameTab('syncLog')) {

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
      <Row className='nexus-c-title-date-picker-container'>
        <Col xs={4} />
        <Col xs={4} className='d-flex justify-content-center'>
            <SyncLogDatePicker
                onDateFromChange={onDateFromChange}
                onDateToChange={onDateToChange}
                dateFrom={dateFrom}
                dateTo={dateTo}
                dateError={dateError}
            />
        </Col>
        <Col xs={4} className='d-flex justify-content-end align-items-center'>
          <Button icon={CloudDownloadIcon} className="p-button-rounded p-button-secondary p-button-text" onClick={() => exportSyncLog(dateFrom, dateTo)} />
        </Col>
      </Row>
    )
  }
  return null;
}

TitleMetadataBottomHeaderPart.propTypes = {
  isItTheSameTab: PropTypes.func,
  uploadHandler: PropTypes.func,
  setDateFrom: PropTypes.func.isRequired,
  dateFrom: PropTypes.string.isRequired,
  setDateTo: PropTypes.func.isRequired,
  dateTo: PropTypes.string.isRequired,
  showSuccess: PropTypes.func,
  showError: PropTypes.func,
};

TitleMetadataBottomHeaderPart.defaultProps = {
  isItTheSameTab: () => null,
  uploadHandler: () => null,
  showSuccess: () => null,
  showError: () => null,
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

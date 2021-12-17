import React from 'react';
import PropTypes from 'prop-types';
import { NexusDatePicker } from '../../../../ui/elements';
import './SyncLogDatePicker.scss';

const SyncLogDatePicker = ({onDateFromChange, onDateToChange, dateFrom, dateTo, dateError}) => {
  const FROM_DATE_ERROR = 'FUTURE DATES ARE NOT ALLOWED!';
  const TO_DATE_ERROR = 'THIS DATE MUST BE AFTER YOUR FROM DATE';

  return (
    <div className="nexus-c-sync-log-table__date-filter">
        <div className="nexus-c-sync-log-table__date-field">
            <NexusDatePicker
                id="nexus-c-sync-log-dateFrom"
                onChange={onDateFromChange}
                value={dateFrom}
                isReturningTime={false}
                isRequired
            />
            <div id="dateFromError" className="nexus-c-sync-log-table__date-field--error">
                {dateError === 'from' && FROM_DATE_ERROR}
            </div>
        </div>
        <div  className="nexus-c-sync-log-table__title-between">TO</div>
        <div className="nexus-c-sync-log-table__date-field">
            <NexusDatePicker
                id="nexus-c-sync-log-dateTo"
                onChange={onDateToChange}
                value={dateTo}
                isReturningTime={false}
            />
            <div id="dateToError" className="nexus-c-sync-log-table__date-field--error">
                {dateError === 'to' && TO_DATE_ERROR}
            </div>
        </div>
    </div>
  )
}

SyncLogDatePicker.propTypes = {
  onDateFromChange: PropTypes.func,
  onDateToChange: PropTypes.func,
  dateFrom: PropTypes.any,
  dateTo: PropTypes.any,
  dateError: PropTypes.any,
};

SyncLogDatePicker.defaultProps = {
  onDateFromChange: () => null,
  onDateToChange: () => null,
  dateFrom: null,
  dateTo: null,
  dateError: null,
};

export default SyncLogDatePicker;

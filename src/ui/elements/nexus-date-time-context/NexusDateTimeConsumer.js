import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {DATETIME_FIELDS} from '../../../util/date-time/constants';
import {NexusDateTimeContext} from './NexusDateTimeProvider';

const DateTimeConsumer = ({dateTime, format, shouldDisplayTime}) => {
    const {renderDateTime} = useContext(NexusDateTimeContext);
    return <>{renderDateTime(dateTime, format, shouldDisplayTime)}</>;
};

export default DateTimeConsumer;

DateTimeConsumer.propTypes = {
    dateTime: PropTypes.string,
    format: PropTypes.string,
    // eslint-disable-next-line
    shouldDisplayTime: PropTypes.bool,
};

DateTimeConsumer.defaultProps = {
    dateTime: '',
    format: DATETIME_FIELDS.BUSINESS_DATETIME,
    shouldDisplayTime: true,
};

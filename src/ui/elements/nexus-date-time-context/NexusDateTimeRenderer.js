import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@atlaskit/tooltip';
import {DATETIME_FIELDS} from '../../../util/date-time/constants';
import {useDateTimeContext} from './NexusDateTimeProvider';

/**
 * Consumes the NexusDateTimeContext to show a timestamp along with a tooltip on hover.
 * The tooltip will display UTC time if the current context is set to local time,
 * and vice versa if the context is set to UTC time.
 *
 * @component
 * @example
 * const value = "2020-08-07T20:41:04.686Z" // required
 * const format = DATETIME_FIELDS.BUSINESS_DATETIME // optional, defaults to true
 * const shouldDisplayTime = true; // optional, defaults to true
 * return (
 *   <DateTimeRenderer value={value} format={format} shouldDisplayTime={shouldDisplayTime}>
 *     {value => <p>{value}</p>}
 *   <DateTimeRenderer />
 * )
 */
const DateTimeRenderer = ({value, format, shouldDisplayTime, children}) => {
    const {renderDateTime, isLocal} = useDateTimeContext();
    return (
        <Tooltip
            content={`${!isLocal ? 'Local Time: ' : ''}${renderDateTime(value, format, shouldDisplayTime, !isLocal)}`}
        >
            {children(renderDateTime(value, format, shouldDisplayTime))}
        </Tooltip>
    );
};

export default DateTimeRenderer;

DateTimeRenderer.propTypes = {
    value: PropTypes.string,
    format: PropTypes.string,
    // eslint-disable-next-line
    shouldDisplayTime: PropTypes.bool,
    children: PropTypes.func,
};

DateTimeRenderer.defaultProps = {
    value: '',
    format: DATETIME_FIELDS.BUSINESS_DATETIME,
    shouldDisplayTime: true,
    children: () => null,
};

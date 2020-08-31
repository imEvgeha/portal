import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@atlaskit/tooltip';
import {DATETIME_FIELDS} from '../../../util/date-time/constants';
import {NexusDateTimeContext} from './NexusDateTimeProvider';

/**
 * Consumes the NexusDateTimeContext to show a timestamp along with a tooltip on hover.
 * The tooltip will display UTC time if the current context is set to local time,
 * and vice versa if the context is set to UTC time.
 */
const DateTimeRenderer = ({value, format, shouldDisplayTime, children}) => {
    const {renderDateTime, isLocal} = useContext(NexusDateTimeContext);
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

import React, {createContext, useState, useCallback} from 'react';
import {ISODateToView} from '../../../util/date-time/DateTimeUtils';

export const NexusDateTimeContext = createContext({});

const NexusDateTimeProvider = ({children}) => {
    const [isLocal, setIsLocal] = useState(false);

    /**
     * Returns a date-time string for the given timestamp and format.
     * @param {string} timestamp the timestamp to render
     * @param {DATETIME_FIELDS} format a `DATETIME_FIELDS` enum value from `src/util/date-time/constants`
     * @param {boolean} shouldDisplayTime set `false` if you don't want to display the time, default true
     */
    const renderDateTime = useCallback(
        (timestamp, format, shouldDisplayTime) => {
            return ISODateToView(timestamp, format, isLocal, shouldDisplayTime);
        },
        [isLocal]
    );

    const context = {
        isLocal,
        setIsLocal,
        renderDateTime,
    };

    return <NexusDateTimeContext.Provider value={context}>{children}</NexusDateTimeContext.Provider>;
};

export default NexusDateTimeProvider;

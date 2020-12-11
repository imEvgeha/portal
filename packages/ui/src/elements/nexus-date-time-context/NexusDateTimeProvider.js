import React, {createContext, useCallback, useContext, useState} from 'react';
import {ISODateToView} from '@vubiquity-nexus/portal-utils/lib/date-time/DateTimeUtils';

export const NexusDateTimeContext = createContext({});

export const useDateTimeContext = () => useContext(NexusDateTimeContext);

/**
 * An app context provider which passes down the user preference of
 * wanting to see timestamps in UTC or in their local time.
 */
const NexusDateTimeProvider = ({children}) => {
    const [isLocal, setIsLocal] = useState(false);

    /**
     * Returns a date-time string for the given timestamp and format.
     * @param {string} timestamp the timestamp to render
     * @param {DATETIME_FIELDS} format a `DATETIME_FIELDS` enum value from `src/util/date-time/constants`
     * @param {boolean} shouldDisplayTime set `false` if you don't want to display the time, default true
     * @param {boolean} [isLocalTime=false] set `true` if time should be rendered in local time
     */
    const renderDateTime = useCallback(
        (timestamp, format, shouldDisplayTime, isLocalTime = isLocal) => {
            return ISODateToView(timestamp, format, isLocalTime, shouldDisplayTime);
        },
        [isLocal]
    );

    // the context that will be made available to any context consumers
    const context = {
        isLocal,
        setIsLocal,
        renderDateTime,
    };

    return <NexusDateTimeContext.Provider value={context}>{children}</NexusDateTimeContext.Provider>;
};

export default NexusDateTimeProvider;

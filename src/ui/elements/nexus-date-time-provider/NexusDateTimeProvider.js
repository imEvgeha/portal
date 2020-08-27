import React, {createContext, useState} from 'react';
import {ISODateToView} from '../../../util/date-time/DateTimeUtils';

export const NexusDateTimeContext = createContext({});

const NexusDateTimeProvider = ({children}) => {
    const [isLocal, setIsLocal] = useState(false);

    /**
     * Returns a date-time string for the given timestamp and format.
     * @param {string} timestamp the timestamp to render
     * @param {DATETIME_FIELDS} format a `DATETIME_FIELDS` enum value from `src/util/date-time/constants`
     */
    const renderDateTime = (timestamp, format) => ISODateToView(timestamp, format, isLocal);

    const context = {
        isLocal,
        setIsLocal,
        renderDateTime,
    };

    return <NexusDateTimeContext.Provider value={context}>{children}</NexusDateTimeContext.Provider>;
};

export default NexusDateTimeProvider;

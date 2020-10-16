import React from 'react';
import {NexusTooltip} from '../../../../../../../ui/elements/';
import Constants from '../Constants';
import './IngestReport.scss';

const IngestReport = params => {
    const {
        valueFormatted,
        data: {ingestReport},
    } = params;
    const content = (
        <div className="nexus-c-ingest-report">
            <div>{valueFormatted}</div>
            <div className="nexus-c-ingest-report__counters">
                {Constants.REPORT_FIELDS.map(({field, displayName}) => (
                    <div key={field} className="nexus-c-ingest-report__counters-section">
                        <label>{displayName}</label>
                        <div className="nexus-c-ingest-report__counters-section--value">{ingestReport[field]}</div>
                    </div>
                ))}
            </div>
        </div>
    );
    return (
        <NexusTooltip content={content}>
            <div>{valueFormatted}</div>
        </NexusTooltip>
    );
};

export default IngestReport;

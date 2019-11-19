import React from 'react';
import PropTypes from 'prop-types';
import Constants from '../Constants';
import './IngestReport.scss';

const IngestReport = params => {
    const {ingestReport = {}, valueFormatted} = params.value || {};
    return (
        <div className='nexus-c-ingest-report'>
            <div>{valueFormatted}</div>
            <div className='nexus-c-ingest-report__counters'>
                {
                    Constants.REPORT_FIELDS.map( report => (
                        <div key={report.field} className='nexus-c-ingest-report__counters-section'>
                            <label>{report.displayName}</label>
                            <div className='nexus-c-ingest-report__counters-section--value'>
                                {ingestReport[report.field]}
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

IngestReport.propTypes = {
    params: PropTypes.object,
};

IngestReport.defaultProps = {
    params: {},
};

export default IngestReport;
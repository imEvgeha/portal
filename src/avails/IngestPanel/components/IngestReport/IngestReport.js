import React from 'react';
import PropTypes from 'prop-types';
import Constants from '../../Constants';
import './IngestReport.scss';

const IngestReport = ({report}) => {
    const reportFields = Constants.REPORT;
    return (
        <div className='ingest-report'>
            {
                Object.keys(reportFields).map(key => (
                    <div className='ingest-report__field'>
                        <span className='ingest-report__field--label'>{reportFields[key]}</span>
                        <span className='ingest-report__field--value'>{report[key] || 0}</span>
                    </div>
                ))
            }
        </div>
    );
};

IngestReport.propTypes = {
    report: PropTypes.object
};

IngestReport.defaultProps = {
    report: {}
};

export default IngestReport;
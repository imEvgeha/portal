import React from 'react';
import PropTypes from 'prop-types';
import Constants from '../../Constants';
import './IngestReport.scss';

const IngestReport = ({report, showErrorMessage = true}) => {
    const reportFields = Constants.REPORT;
    const reportValues = report || {};
    return (
        <div className='ingest-report'>
            <div className='ingest-report__fields'>
                {
                    Object.keys(reportFields).map(key => (
                        <div className='ingest-report__field' key={key}>
                            <span className='ingest-report__field--label'>{reportFields[key]}</span>
                            <span className='ingest-report__field--value'>{reportValues[key] || ''}</span>
                        </div>
                    ))
                }
            </div>
            {
                showErrorMessage && report.errorDetails && (
                    <span className='ingest-report__error-message'>
                        {report.errorDetails}
                    </span>
                )
            }
        </div>
    );
};

IngestReport.propTypes = {
    report: PropTypes.object,
    showErrorMessage: PropTypes.bool,
};

IngestReport.defaultProps = {
    report: {},
    showErrorMessage: true
};

export default IngestReport;
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Constants from '../../constants';
import './IngestReport.scss';

const IngestReport = ({report, showErrorMessage = true, filterClick, gridApi}) => {
    const [activeFilter, setActiveFilter] = useState('');
    const reportFields = Constants.REPORT;
    const reportValues = report || {};
    const onFilterClick = filterKey => {
        const key = activeFilter === filterKey ? '' : filterKey;
        filterClick(reportFields[key]);
        setActiveFilter(key);
        gridApi.refreshInfiniteCache();
    };
    return (
        <div className='ingest-report'>
            <div className='ingest-report__fields'>
                {
                    Object.keys(reportFields).map(key => (
                        <div className='ingest-report__field' key={key}>
                            <span className='ingest-report__field--label'>{reportFields[key]}</span>
                            <span
                                className={`ingest-report__field--value ${(activeFilter === key) ? 'filter-active' : ''}`}
                                onClick={() => onFilterClick(key)} >
                                {reportValues[key] || ''}
                            </span>
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
    filterClick: PropTypes.func,
};

IngestReport.defaultProps = {
    report: {},
    showErrorMessage: true,
    filterClick: () => null,
};

export default IngestReport;

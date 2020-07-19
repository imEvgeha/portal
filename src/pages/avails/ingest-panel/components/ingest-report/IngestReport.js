import React, {useState, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import RightsURL from '../../../../legacy/containers/avail/util/RightsURL';
import Constants from '../../constants';
import './IngestReport.scss';

const IngestReport = ({
    report,
    isShowingError = true,
    filterClick,
    ingestId,
}) => {
    const [activeFilter, setActiveFilter] = useState('total');
    const reportFields = Constants.REPORT;
    const reportValues = report || {};

    const onFilterClick = useCallback(filterKey => {
        const key = activeFilter === filterKey ? 'total' : filterKey;
        filterClick(reportFields[key].value);
        setActiveFilter(key);
    }, [activeFilter, filterClick, reportFields]);

    useEffect(() => {
        onFilterClick('total');
    }, [report, onFilterClick]);

    const FILTERABLE_KEYS = ['total', 'pending', 'errors'];

    return (
        <div className="ingest-report">
            <div className="ingest-report__fields">
                {
                    Object.keys(reportFields).map(key => (
                        <div className="ingest-report__field" key={key}>
                            <span className="ingest-report__field--label">{reportFields[key].label}</span>
                            <span
                                className={classnames(
                                    'ingest-report__field--value',
                                    (activeFilter === key) && 'filter-active'
                                )}
                                onClick={() => (
                                    key === 'fatal'
                                        ? window.open(RightsURL.getFatalsRightsSearchUrl(ingestId), '_blank')
                                        : FILTERABLE_KEYS.includes(key) && onFilterClick(key)
                                )}
                            >
                                {reportValues[key] || 0}
                            </span>
                        </div>
                    ))
                }
            </div>
            {
                isShowingError && report.errorDetails && (
                    <span className="ingest-report__error-message">
                        {report.errorDetails}
                    </span>
                )
            }
        </div>
    );
};

IngestReport.propTypes = {
    report: PropTypes.object,
    isShowingError: PropTypes.bool,
    filterClick: PropTypes.func,
    ingestId: PropTypes.string,
};

IngestReport.defaultProps = {
    report: {},
    isShowingError: true,
    filterClick: () => null,
    ingestId: '',
};

export default IngestReport;

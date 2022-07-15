/* eslint-disable no-magic-numbers */
import React, {useState, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';
import NexusTooltip from '@vubiquity-nexus/portal-ui/lib/elements/nexus-tooltip/NexusTooltip';
import classnames from 'classnames';
import {tabFilter, ERRORS_UNMATCHED} from '../../../../legacy/constants/avails/manualRightsEntryTabs';
import {rightsService} from '../../../../legacy/containers/avail/service/RightsService';
import RightsURL from '../../../../legacy/containers/avail/util/RightsURL';
import Loading from '../../../../static/Loading';
import Constants from '../../constants';
import './IngestReport.scss';

const IngestReport = ({report, isShowingError = true, filterClick, attachmentId, ingestId}) => {
    const [activeFilter, setActiveFilter] = useState('total');
    const [currentValues, setCurrentValues] = useState([]);
    const [loading, setLoading] = useState(false);
    const reportFields = Constants.REPORT;
    const reportValues = report || {};

    const onFilterClick = useCallback(
        filterKey => {
            const key = activeFilter === filterKey ? 'total' : filterKey;
            filterClick(reportFields[key].value);
            setActiveFilter(key);
        },
        [activeFilter, filterClick, reportFields]
    );

    const getCustomSearchCriteria = () => {
        return Object.assign({ingestHistoryAttachmentIds: attachmentId}, tabFilter.get(ERRORS_UNMATCHED), {
            availHistoryIds: ingestId,
        });
    };

    useEffect(() => {
        setLoading(true);
        rightsService.advancedSearch(getCustomSearchCriteria(), 0, 10000).then(response => {
            const updatedCurrentValues = [];
            updatedCurrentValues['errors'] = response.data.filter(d => d.status === 'Error').length;
            updatedCurrentValues['pending'] = response.data.filter(d => d.status === 'Pending').length;
            setCurrentValues(updatedCurrentValues);
            setLoading(false);
        });
    }, [attachmentId]);

    useEffect(() => {
        onFilterClick('total');
    }, [report, onFilterClick]);

    const FILTERABLE_KEYS = ['total', 'pending', 'errors'];
    const ORIGINAL_VALUES_KEYS = ['pending', 'errors'];

    const createTag = key => (
        <div
            className="ingest-report__field"
            key={key}
            onClick={() =>
                key === 'fatal'
                    ? window.open(RightsURL.getFatalsRightsSearchUrl(ingestId), '_blank')
                    : FILTERABLE_KEYS.includes(key) && onFilterClick(key)
            }
            role="button"
        >
            <span
                className={classnames('ingest-report__field-label', {
                    'ingest-report__field-label--is-selectable': key === 'fatal',
                })}
            >
                {reportFields[key].label}
            </span>
            <div
                className={classnames('ingest-report__field-value', {
                    'filter-active': activeFilter === key,
                    'ingest-report__field-value--is-selectable': key === 'fatal',
                })}
            >
                {ORIGINAL_VALUES_KEYS.includes(key) ? currentValues[key] || 0 : reportValues[key] || 0}
            </div>
        </div>
    );

    const createTooltipTag = key => (
        <NexusTooltip
            key={key}
            content={`Original Value: ${reportFields[key].label} (${reportValues[key]?.toString()})`}
        >
            {createTag(key)}
        </NexusTooltip>
    );

    return (
        <div className="ingest-report">
            {loading ? (
                <Loading />
            ) : (
                <>
                    <div className="ingest-report__fields">
                        {Object.keys(reportFields).map(key =>
                            ORIGINAL_VALUES_KEYS.includes(key) ? createTooltipTag(key) : createTag(key)
                        )}
                    </div>
                    {isShowingError && report.errorDetails && (
                        <span className="ingest-report__error-message">{report.errorDetails}</span>
                    )}
                </>
            )}
        </div>
    );
};

IngestReport.propTypes = {
    report: PropTypes.object,
    isShowingError: PropTypes.bool,
    filterClick: PropTypes.func,
    ingestId: PropTypes.string,
    attachmentId: PropTypes.string,
};

IngestReport.defaultProps = {
    report: {},
    isShowingError: true,
    filterClick: () => null,
    ingestId: '',
    attachmentId: '',
};

export default IngestReport;

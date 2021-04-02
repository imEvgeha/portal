import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import Select from '@atlaskit/select';
import {connect} from 'react-redux';
import {NexusDateTimeWindowPicker} from '../../../../../ui/elements';
import Constants from '../../constants';
import {getFilterLoadingState} from '../../ingestSelectors';
import {getFiltersToSend, getInitialFilters} from '../../utils';
import './IngestFilters.scss';

const IngestFilters = ({onFiltersChange, isFilterLoading}) => {
    const {
        filterKeys: {LICENSOR, STATUS, INGEST_TYPE, EMAIL_SUBJECT, FILE_NAME},
        STATUS_LIST,
        INGEST_LIST,
    } = Constants;

    const [filters, setFilters] = useState(getInitialFilters());
    const [isApplyActive, setIsApplyActive] = useState(false);

    const onFilterChange = (name, value) => {
        setFilters({...filters, [name]: value});
        setIsApplyActive(true);
    };

    const onDateChange = dates => {
        setFilters({...filters, ...dates});
        setIsApplyActive(true);
    };

    const clearFilters = () => {
        setFilters({
            status: STATUS_LIST[0],
            licensor: '',
            ingestType: INGEST_LIST[0],
            startDate: '',
            endDate: '',
        });
        setIsApplyActive(false);
        onFiltersChange({});
    };

    const applyFilters = () => {
        onFiltersChange(getFiltersToSend(filters));
    };

    return (
        <div className="ingest-filters">
            <div className="ingest-filters__row1">
                <div className="ingest-filters__section">
                    Licensor
                    <input
                        placeholder="Enter Licensor"
                        value={filters.licensor}
                        onChange={e => onFilterChange(LICENSOR, e.target.value)}
                    />
                </div>
                <div className="ingest-filters__section">
                    Avail Status
                    <Select
                        options={Constants.STATUS_LIST}
                        value={filters.status}
                        onChange={value => onFilterChange(STATUS, value)}
                    />
                </div>
            </div>
            <div className="ingest-filters__row2">
                <NexusDateTimeWindowPicker
                    isUsingTime={false}
                    isTimestamp={true}
                    startDateTimePickerProps={{
                        id: 'ingest-filters__start-date',
                        placeholder: 'mm/dd/YYYY',
                        value: filters.startDate,
                    }}
                    endDateTimePickerProps={{
                        id: 'ingest-filters__end-date',
                        placeholder: 'mm/dd/YYYY',
                        value: filters.endDate,
                    }}
                    onChangeAny={onDateChange}
                    labels={Constants.DATEPICKER_LABELS}
                />
            </div>
            <div className="ingest-filters__row3">
                <div className="ingest-filters__section">
                    Ingest Method
                    <Select
                        options={Constants.INGEST_LIST}
                        value={filters.ingestType}
                        onChange={value => onFilterChange(INGEST_TYPE, value)}
                    />
                </div>
                {filters.ingestType?.value === Constants.ingestTypes.EMAIL.toUpperCase() && (
                    <>
                        <div className="ingest-filters__section">
                            Email Subject
                            <input
                                placeholder="Enter subject"
                                value={filters.emailSubject}
                                onChange={e => onFilterChange(EMAIL_SUBJECT, e.target.value)}
                            />
                        </div>
                        <div className="ingest-filters__section ingest-filters__section--filename">
                            Attachment File Name
                            <input
                                placeholder="Enter file name"
                                value={filters[FILE_NAME]}
                                onChange={e => onFilterChange(FILE_NAME, e.target.value)}
                            />
                        </div>
                    </>
                )}
            </div>
            <div className="ingest-filters__actions">
                <Button onClick={clearFilters}>Clear All</Button>
                <Button
                    onClick={applyFilters}
                    appearance="primary"
                    isDisabled={!isApplyActive}
                    isLoading={isFilterLoading}
                >
                    Apply Filter
                </Button>
            </div>
        </div>
    );
};

IngestFilters.propTypes = {
    onFiltersChange: PropTypes.func.isRequired,
    isFilterLoading: PropTypes.bool,
};

IngestFilters.defaultProps = {
    isFilterLoading: false,
};

const mapStateToProps = () => {
    return state => ({
        isFilterLoading: getFilterLoadingState(state),
    });
};

export default connect(mapStateToProps)(IngestFilters);

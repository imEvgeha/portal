import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Select from '@atlaskit/select/Select';
import Button from '@atlaskit/button/dist/cjs/components/Button';
import {NexusDateTimeWindowPicker} from '../../../../ui-elements';
import Constants from '../../constants';
import {getFiltersToSend, getInitialFilters} from '../../utils';
import './IngestFilters.scss';

const IngestFilters = ({onFiltersChange}) => {
    const {filterKeys: {PROVIDER, STATUS}, STATUS_LIST} = Constants;

    const [filters, setFilters] = useState(getInitialFilters());
    const [isApplyActive, setIsApplyActive] = useState(false);

    const onFilterChange = (name, value) => {
        setFilters({...filters, [name]: value});
        setIsApplyActive(true);
    };

    const onDateChange = (dates) => {
        setFilters({...filters, ...dates});
        setIsApplyActive(true);
    };

    const clearFilters = () => {
        setFilters({
            status: STATUS_LIST[0],
            provider: '',
            startDate: '',
            endDate: ''
        });
        setIsApplyActive(false);
        onFiltersChange({});
    };

    const applyFilters = () => {
        onFiltersChange(getFiltersToSend(filters));
    };

    return (
        <div className='ingest-filters'>
            <div className='ingest-filters__row1'>
                <div className='ingest-filters__section'>
                    Provider
                    {' '}
                    <input
                        placeholder='Enter Provider'
                        value={filters.provider}
                        onChange={e => onFilterChange(PROVIDER, e.target.value)}
                    />
                </div>
                <div className='ingest-filters__section'>
                    Avail Status
                    <Select
                        options={Constants.STATUS_LIST}
                        value={filters.status}
                        onChange={value => onFilterChange(STATUS, value)}
                    />
                </div>
            </div>
            <div className='ingest-filters__row2'>
                <NexusDateTimeWindowPicker
                    isUsingTime={false}
                    isTimestamp={true}
                    startDateTimePickerProps={{
                        id:'ingest-filters__start-date', placeholder: 'mm/dd/YYYY', value: filters.startDate
                    }}
                    endDateTimePickerProps={{
                        id:'ingest-filters__end-date', placeholder: 'mm/dd/YYYY', value: filters.endDate
                    }}
                    onChangeAny={onDateChange}
                    labels={Constants.DATEPICKER_LABELS}
                />
            </div>
            <div className='ingest-filters__actions'>
                <Button onClick={clearFilters}>Clear All</Button>
                <Button
                    className={`ingest-filters__actions--apply ${isApplyActive ? 'ingest-filters__actions--active' : ''}`}
                    onClick={applyFilters}
                >
                    Apply Filter
                </Button>
            </div>
        </div>
    );
};

IngestFilters.propTypes = {
    onFiltersChange: PropTypes.func.isRequired,
};

export default IngestFilters;

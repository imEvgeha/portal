import React, {useState} from 'react';
import Button from '@atlaskit/button';
import AvailsIcon from '../../assets/Avails.svg';
import PopOutIcon from '../../assets/action-shortcut.svg';
import FilterIcon from '../../assets/filter.svg';
import FilterSolidIcon from '../../assets/filter-solid.svg';
import NexusDateTimeWindowPicker from '../../ui-elements/nexus-date-time-window-picker/NexusDateTimeWindowPicker';
import Select from '@atlaskit/select';
import Constants from './Constants';
import './Ingest.scss';

const Ingest = () => {

    const initialFilters = {
        status: Constants.STATUS_LIST[0],
        provider: ''
    };

    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState(initialFilters);
    const [isApplyActive, setIsApplyActive] = useState(false);

    const toggleFilters = () => {
      setShowFilters(!showFilters);
    };

    const onFilterChange = (name, value) => {
        setFilters({...filters, [name]: value});
        setIsApplyActive(true);
    };

    const onDateChange = (dates) => {
        setFilters({...filters, ...dates});
        setIsApplyActive(true);
    };

    const clearFilters = () => {
        setFilters(initialFilters);
        setIsApplyActive(false);
    };

    const applyFilters = () => {
        return filters;
    };

    return (
        <div className='ingest-wrapper'>
            <div className='ingest-header'>
                <div className='ingest-header__title'>
                    <AvailsIcon />
                    <div>Avails Ingest</div>
                </div>
                <div className='ingest-header__actions'>
                    <PopOutIcon
                        className='ingest-header__actions--pop'
                        disabled={true}/>
                    <div onClick={toggleFilters}>
                        {
                            showFilters ? <FilterSolidIcon/> : <FilterIcon/>
                        }
                    </div>
                </div>
            </div>
            {
                showFilters && (
                    <div className='ingest-filters'>
                        <div className='ingest-filters__row1'>
                            <div className='ingest-filters__section'>
                                Provider
                                <input
                                    placeholder='Enter Provider'
                                    value={filters.provider}
                                    onChange={e => onFilterChange('provider', e.target.value)}/>
                            </div>
                            <div className='ingest-filters__section'>
                                Avail Status
                                <Select
                                    options={Constants.STATUS_LIST}
                                    value={filters.status}
                                    onChange={value => onFilterChange('status', value)}/>
                            </div>
                        </div>
                        <div className='ingest-filters__row2'>
                            <NexusDateTimeWindowPicker
                                isUsingTime={false}
                                startDateTimePickerProps={{
                                    id:'ingest-filters__start-date', placeholder: 'mm/dd/YYYY', value: filters.startDate
                                }}
                                endDateTimePickerProps={{
                                    id:'ingest-filters__end-date', placeholder: 'mm/dd/YYYY', value: filters.endDate
                                }}
                                onChange={onDateChange}
                                labels={Constants.DATEPICKER_LABELS}/>
                        </div>
                        <div className='ingest-filters__actions'>
                            <Button onClick={clearFilters}>Clear All</Button>
                            <Button
                                className={isApplyActive ? 'ingest-filters__actions--active' : ''}
                                onClick={applyFilters}>
                                Apply Filter
                            </Button>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default Ingest;
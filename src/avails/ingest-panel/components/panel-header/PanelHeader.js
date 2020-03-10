import React from 'react';
import PropTypes from 'prop-types';
import AvailsIcon from '../../../../assets/avails.svg';
import FilterSolidIcon from '../../../../assets/filter-solid.svg';
import FilterIcon from '../../../../assets/filter.svg';
import IngestFilters from '../ingest-filters/IngestFilters';
import './PanelHeader.scss';

const PanelHeader = ({toggleFilters, onFiltersChange, showFilters}) => {
    return (
        <>
            <div className='ingest-header'>
                <div className='ingest-header__title'>
                    <AvailsIcon />
                    <div>Avails</div>
                </div>
                <div className='ingest-header__actions'>
                    <div onClick={toggleFilters}>
                        {
                            showFilters ? <FilterSolidIcon /> : <FilterIcon />
                        }
                    </div>
                </div>
            </div>
            {
                showFilters && (<IngestFilters onFiltersChange={onFiltersChange} />)
            }
        </>
    );
};

PanelHeader.propTypes = {
    toggleFilters: PropTypes.func,
    onFiltersChange: PropTypes.func,
    showFilters: PropTypes.bool,
};

PanelHeader.defaultProps = {
    toggleFilters: () => null,
    onFiltersChange: () => null,
    showFilters: false,
};

export default PanelHeader;

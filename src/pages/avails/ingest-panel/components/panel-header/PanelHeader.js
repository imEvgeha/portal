import React from 'react';
import PropTypes from 'prop-types';
import AvailsIcon from '../../../../../assets/avails.svg';
import FilterSolidIcon from '../../../../../assets/filter-solid.svg';
import FilterIcon from '../../../../../assets/filter.svg';
import IngestFilters from '../ingest-filters/IngestFilters';
import './PanelHeader.scss';

const PanelHeader = ({toggleFilters, onFiltersChange, isShowingFilters}) => {
    return (
        <>
            <div className="ingest-header">
                <div className="ingest-header__title">
                    <AvailsIcon />
                    <div>Avails</div>
                </div>
                <div className="ingest-header__actions">
                    <div onClick={toggleFilters}>
                        {isShowingFilters ? <FilterSolidIcon /> : <FilterIcon />}
                    </div>
                </div>
            </div>
            {isShowingFilters && (<IngestFilters onFiltersChange={onFiltersChange} />)}
        </>
    );
};

PanelHeader.propTypes = {
    toggleFilters: PropTypes.func,
    onFiltersChange: PropTypes.func,
    isShowingFilters: PropTypes.bool,
};

PanelHeader.defaultProps = {
    toggleFilters: () => null,
    onFiltersChange: () => null,
    isShowingFilters: false,
};

export default PanelHeader;

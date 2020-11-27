import React from 'react';
import PropTypes from 'prop-types';
import AvailsIcon from '@vubiquity-nexus/portal-assets/avails.svg';
import FilterSolidIcon from '@vubiquity-nexus/portal-assets/filter-solid.svg';
import FilterIcon from '@vubiquity-nexus/portal-assets/filter.svg';
import classnames from 'classnames';
import IngestFilters from '../ingest-filters/IngestFilters';
import './PanelHeader.scss';

const PanelHeader = ({toggleFilters, onFiltersChange, isShowingFilters}) => {
    const ingestHeaderClassnames = classnames('ingest-header', {
        'ingest-header--no-border': isShowingFilters,
    });
    return (
        <>
            <div className={ingestHeaderClassnames}>
                <div className="ingest-header__title-container">
                    <AvailsIcon />
                    <h1 className="ingest-header__title">Avails</h1>
                </div>
                <div className="ingest-header__actions">
                    <div onClick={toggleFilters}>{isShowingFilters ? <FilterSolidIcon /> : <FilterIcon />}</div>
                </div>
            </div>
            {isShowingFilters && <IngestFilters onFiltersChange={onFiltersChange} />}
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

import React from 'react';
import PropTypes from 'prop-types';
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
                    <i className="po po-avails" />
                    <h1 className="ingest-header__title">Avails</h1>
                </div>
                <div className="ingest-header__actions">
                    <i className="po po-filter" onClick={toggleFilters} />
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

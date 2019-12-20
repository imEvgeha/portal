import React, {useState} from 'react';
import AvailsIcon from '../../assets/Avails.svg';
import PopOutIcon from '../../assets/action-shortcut.svg';
import FilterIcon from '../../assets/filter.svg';
import FilterSolidIcon from '../../assets/filter-solid.svg';
import IngestFilters from './components/ingest-filters/IngestFilters';
import './IngestPanel.scss';

const IngestPanel = () => {
    const [showFilters, setShowFilters] = useState(false);
    const toggleFilters = () => {
      setShowFilters(!showFilters);
    };

    return (
        <div className='ingest-panel'>
            <div className='ingest-panel__ingest-header'>
                <div className='ingest-panel__ingest-header__title'>
                    <AvailsIcon />
                    <div>Avails</div>
                </div>
                <div className='ingest-panel__ingest-header__actions'>
                    <PopOutIcon
                        className='ingest-panel__ingest-header__actions--pop'
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
                    <IngestFilters onFiltersChange={() => null} />
                )
            }
        </div>
    );
};

export default IngestPanel;
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import './SearchComponent.scss';

const SearchComponent = ({onFilterChange}) => {
    const [searchBy, setSearchBy] = useState('');

    const handleSearchByChange = event => {
        const {value} = event.target || {};
        setSearchBy(value);
    };

    const handleKeyPress = e => {
        if (e.key === 'Enter') {
            onFilterChange(searchBy);
        }
    };

    return (
        <div className="selected-rights-search-container">
            <input
                type="text"
                className="form-control"
                placeholder="Search by title"
                name="text"
                value={searchBy}
                onChange={handleSearchByChange}
                onKeyPress={handleKeyPress}
            />
        </div>
    );
};

SearchComponent.propTypes = {
    onFilterChange: PropTypes.func,
};

export default SearchComponent;

import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {Checkbox} from '@atlaskit/checkbox';
import './ArtworkActions.scss';

const ArtworkActions = ({selectedItems, totalItems, setItems}) => {
    const [isChecked, setIsChecked] = useState(false);
    useEffect(() => {
        setIsChecked(!!selectedItems.length);
    }, [selectedItems.length]);

    const handleSelectAll = () => {
        setIsChecked(!isChecked);
        setItems(setItems);
    };

    return (
        <div className="artwork-actions">
            <Checkbox
                onChange={handleSelectAll}
                isChecked={isChecked}
                isIndeterminate={selectedItems.length && selectedItems.length !== totalItems.length}
            />
            <span className="artwork-actions__selected-count">
                {`${selectedItems.length} ${selectedItems.length === 1 ? 'image' : 'images'} selected`}
            </span>
            {!!selectedItems.length && <Button appearance="danger">Reject Selected</Button>}
        </div>
    );
};

ArtworkActions.propTypes = {
    selectedItems: PropTypes.array,
    totalItems: PropTypes.array,
    setItems: PropTypes.func.isRequired,
};

ArtworkActions.defaultProps = {
    selectedItems: [],
    totalItems: [],
};

export default ArtworkActions;

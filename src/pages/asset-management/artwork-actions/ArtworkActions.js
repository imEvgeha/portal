import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {Checkbox} from '@atlaskit/checkbox';
import './ArtworkActions.scss';

const ArtworkActions = ({selectedItems, totalItems, setItems}) => {
    const [isChecked, setIsChecked] = useState(false);
    useEffect(() => {
        setIsChecked(!!selectedItems);
    }, [selectedItems]);

    const handleSelectAll = () => {
        setIsChecked(!isChecked);
        setItems(setItems);
    };

    return (
        <div className="artwork-actions">
            <Checkbox
                onChange={handleSelectAll}
                isChecked={isChecked}
                isIndeterminate={selectedItems && selectedItems !== totalItems}
            />
            <span className="artwork-actions__selected-count">
                {`${selectedItems} ${selectedItems === 1 ? 'image' : 'images'} selected`}
            </span>
            {!!selectedItems && <Button appearance="danger">Reject Selected</Button>}
        </div>
    );
};

ArtworkActions.propTypes = {
    selectedItems: PropTypes.number,
    totalItems: PropTypes.number,
    setItems: PropTypes.func.isRequired,
};

ArtworkActions.defaultProps = {
    selectedItems: 0,
    totalItems: 0,
};

export default ArtworkActions;

import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {Checkbox} from '@atlaskit/checkbox';
import './ArtworkActions.scss';

const ArtworkActions = ({selectedItems, posterList, setSelectedItems}) => {
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        setIsChecked(!!selectedItems);
    }, [selectedItems]);

    const handleSelectAll = () => {
        if (isChecked) {
            setSelectedItems([]);
        } else {
            setSelectedItems(posterList.map(item => item.id));
        }

        setIsChecked(!isChecked);
    };

    const handleRejectAll = () => {
        setIsChecked(false);
        setSelectedItems([]);
    };

    return (
        <div className="artwork-actions">
            <Checkbox
                onChange={handleSelectAll}
                isChecked={isChecked}
                isIndeterminate={selectedItems && selectedItems !== posterList.length}
            />
            <span className="artwork-actions__selected-count">
                {`${selectedItems} ${selectedItems === 1 ? 'image' : 'images'} selected`}
            </span>
            {!!selectedItems && (
                <Button onClick={handleRejectAll} appearance="danger">
                    Reject Selected
                </Button>
            )}
        </div>
    );
};

ArtworkActions.propTypes = {
    selectedItems: PropTypes.number,
    posterList: PropTypes.array,
    setSelectedItems: PropTypes.func.isRequired,
};

ArtworkActions.defaultProps = {
    selectedItems: 0,
    posterList: [],
};

export default ArtworkActions;

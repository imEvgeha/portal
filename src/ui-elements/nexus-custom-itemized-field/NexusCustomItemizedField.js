// eslint-disable-next-line no-unused-vars
import React, {useState, useContext, useEffect, Fragment} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import AddIcon from '@atlaskit/icon/glyph/add';
import './NexusCustomItemizedField.scss';
import {NexusModalContext} from '../nexus-modal/NexusModal';
import {
    RemovableButton,
    TerritoryTag,
} from '../../containers/avail/custom-form-components/CustomFormComponents';

const PLACEHOLDER = 'Add...';

const NexusCustomItemizedField = ({
    form: Form,
    existingItems,
    onSubmit,
}) => {
    const [items, setItems] = useState(existingItems);
    const {setModalContent, close}= useContext(NexusModalContext);

    useEffect(() => setItems(existingItems), [existingItems]);

    const addItem = () => {
        const content = (
            <Form
                onClose={close}
                onSubmit={(e) => {
                    submitChanges(e);
                }}
            />
        );
        setModalContent(content);
    };

    // Filters out the item at given index
    const getFilteredItems = (arr = [], index) => arr.filter((element, i) => i !== index);

    const submitChanges = (item) => {
        const combinedItems = [...items, item];
        onSubmit(combinedItems);

        setItems(combinedItems);
    };

    return (
        <div className="nexus-c-nexus-custom-itemized-field">
            <div className="nexus-c-nexus-custom-itemized-field__content">
                <div className="nexus-c-nexus-custom-itemized-field__clickable-text" onClick={addItem}>
                    {!items.length &&
                        PLACEHOLDER
                    }
                </div>
                {items.map((item, index) => (
                    // TODO: Refactor using AtlasKit
                    <TerritoryTag isCreate key={index}>
                        {item.country}
                        <RemovableButton onClick={() => setItems(getFilteredItems(items, index))}>
                            x
                        </RemovableButton>
                    </TerritoryTag>
                ))}
            </div>
            <div className="nexus-c-nexus-custom-itemized-field__controls">
                <Button onClick={addItem} className="button-fix">
                    <AddIcon />
                </Button>
            </div>
        </div>
    );
};

NexusCustomItemizedField.propTypes = {
    existingItems: PropTypes.arrayOf(PropTypes.object),
    form: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
    onSubmit: PropTypes.func.isRequired,
};

NexusCustomItemizedField.defaultProps = {
    existingItems: [],
};

export default NexusCustomItemizedField;

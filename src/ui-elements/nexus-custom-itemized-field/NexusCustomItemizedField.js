// eslint-disable-next-line no-unused-vars
import React, {useState, useContext, useEffect, Fragment} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import AddIcon from '@atlaskit/icon/glyph/add';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import EditorDoneIcon from '@atlaskit/icon/glyph/editor/done';
import './NexusCustomItemizedField.scss';
import {NexusModalContext} from '../nexus-modal/NexusModal';
import {
    RemovableButton,
    TerritoryTag,
} from '../../containers/avail/custom-form-components/CustomFormComponents';

const PLACEHOLDER = 'Press \'+\' to add a new item...';

const NexusCustomItemizedField = ({
    form: Form,
    items,
    onSubmit,
}) => {
    const [addedItems, setAddedItems] = useState([]);
    const [existingItems, setExistingItems] = useState(items);
    const {setModalContent, close}= useContext(NexusModalContext);

    useEffect(() => setExistingItems(items));

    const addItem = () => {
        const content = (
            <Form
                onClose={close}
                onSubmit={(e) => setAddedItems([...addedItems, e])}
            />
        );
        setModalContent(content);
    };

    // Filters out the item at given index
    const getFilteredItems = (arr = [], index) => arr.filter((element, i) => i !== index);

    const submitChanges = () => {
        // Merging both old and added items because old items can be changed too
        const combinedItems = [...existingItems, ...addedItems];
        onSubmit(combinedItems);

        // Update existingItems and clean addedItems
        setExistingItems(combinedItems);
        setAddedItems([]);
    };

    const cancelChanges = () => setAddedItems([]);

    return (
        <div className="nexus-c-nexus-custom-itemized-field">
            <div className="nexus-c-nexus-custom-itemized-field__content">
                {(!existingItems.length && !addedItems.length) &&
                    PLACEHOLDER
                }
                {existingItems.map((item, index) => (
                    // TODO: Refactor using AtlasKit
                    <TerritoryTag isCreate key={index}>
                        {item.country}
                        <RemovableButton onClick={() => setExistingItems(getFilteredItems(existingItems, index))}>
                            x
                        </RemovableButton>
                    </TerritoryTag>
                ))}
                {addedItems.map((item, index) => (
                    // TODO: Refactor using AtlasKit
                    <TerritoryTag isCreate key={index}>
                        {item.country}
                        <RemovableButton onClick={() => setAddedItems(getFilteredItems(addedItems, index))}>
                            x
                        </RemovableButton>
                    </TerritoryTag>
                ))}
            </div>
            <div className="nexus-c-nexus-custom-itemized-field__controls">
                {!!addedItems.length &&
                    <>
                        <Button appearance="subtle" onClick={submitChanges} className="button-fix">
                            <EditorDoneIcon />
                        </Button>
                        <Button appearance="subtle" onClick={cancelChanges} className="button-fix">
                            <EditorCloseIcon />
                        </Button>
                    </>
                }
                <Button onClick={addItem} className="button-fix">
                    <AddIcon />
                </Button>
            </div>
        </div>
    );
};

NexusCustomItemizedField.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
    form: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
    onSubmit: PropTypes.func.isRequired,
};

NexusCustomItemizedField.defaultProps = {
    items: [],
};

export default NexusCustomItemizedField;

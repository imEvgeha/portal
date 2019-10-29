// eslint-disable-next-line no-unused-vars
import React, {useState, useContext, useEffect, Fragment} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import AddIcon from '@atlaskit/icon/glyph/add';
import {renderer} from 'react-forms-processor-atlaskit';
import {Form} from 'react-forms-processor';
import isEqual from 'lodash.isequal';
import {
    RemovableButton,
    TerritoryTag,
} from '../../containers/avail/custom-form-components/CustomFormComponents';
import {NexusModalContext} from '../nexus-modal/NexusModal';
import './NexusMultiInstanceField.scss';

const PLACEHOLDER = 'Add...';

const NexusMultiInstanceField = ({
    schema,
    existingItems,
    onSubmit,
    initialValue,
}) => {
    const [items, setItems] = useState(existingItems);
    const [editIndex, setEditIndex] = useState(-1);
    const [formValue, setFormValue] = useState(initialValue);
    const {setModalContent, setModalActions, close}= useContext(NexusModalContext);

    useEffect(() => setItems(existingItems), [existingItems]);
    useEffect(() => {
        if (!isEqual(initialValue, formValue)) {
            const callback = editIndex < 0 ? submitNewItem : submitEditedItems;
            addOrEditItem(formValue, callback);
        }
    }, [formValue]);

    const addOrEditItem = (value, callback) => {
        value && setFormValue(value);
        const content = (
            <>
                <Form
                    renderer={renderer}
                    defaultFields={schema}
                    value={value || formValue}
                    onSubmit={callback}
                    onChange={value => setFormValue(value)}
                />
            </>
        );

        setModalActions([{text: 'Cancel', onClick: () => {setEditIndex(-1); setFormValue({}); close();}}, {text: 'Submit', onClick: callback}]);
        setModalContent(content);
    };

    // Filters out the item at given index
    const getFilteredItems = (arr = [], index) => arr.filter((element, i) => i !== index);

    const submitEditedItems = () => {
        const itemsClone = items;
        itemsClone[editIndex] = formValue;
        onSubmit(itemsClone);

        setItems(itemsClone);
        setEditIndex(-1);
        setFormValue({});
        close();
    };

    const submitNewItem = () => {
        const combinedItems = [...items, formValue];
        onSubmit(combinedItems);

        setItems(combinedItems);
        setFormValue({});
        close();
    };

    return (
        <div className="nexus-c-nexus-multi-instance-field">
            <div className="nexus-c-nexus-multi-instance-field__content">
                <div className="nexus-c-nexus-multi-instance-field__clickable-text" onClick={() => {addOrEditItem(formValue, submitNewItem);}}>
                    {!items.length && PLACEHOLDER}
                </div>
                {items.map((item, index) => (
                    // TODO: Refactor using AtlasKit
                    <TerritoryTag
                        key={index}
                        onClick={() => {setEditIndex(index); addOrEditItem(item, submitEditedItems);}}
                        isCreate
                    >
                        {item.country}
                        <RemovableButton onClick={() => {setItems(getFilteredItems(items, index));}}>
                            x
                        </RemovableButton>
                    </TerritoryTag>
                ))}
            </div>
            <div className="nexus-c-nexus-multi-instance-field__controls">
                <Button onClick={() => addOrEditItem(formValue, submitNewItem)} className="button-fix">
                    <AddIcon />
                </Button>
            </div>
        </div>
    );
};

NexusMultiInstanceField.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    schema: PropTypes.arrayOf(PropTypes.object).isRequired,
    existingItems: PropTypes.arrayOf(PropTypes.object),
    initialValue: PropTypes.object,
};

NexusMultiInstanceField.defaultProps = {
    existingItems: [],
    initialValue: {},
};

export default NexusMultiInstanceField;

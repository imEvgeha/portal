// eslint-disable-next-line no-unused-vars
import React, {useState, useContext, useEffect, Fragment} from 'react';
import PropTypes from 'prop-types';
import {renderer} from 'react-forms-processor-atlaskit';
import {Form} from 'react-forms-processor';
import isEmpty from 'lodash.isempty';
import {uid} from 'react-uid';
import Button from '@atlaskit/button';
import InlineEdit from '@atlaskit/inline-edit';
import AddIcon from '@atlaskit/icon/glyph/add';
import {NexusModalContext} from '../nexus-modal/NexusModal';
import NexusTag from '../nexus-tag/NexusTag';
import './NexusMultiInstanceField.scss';

const PLACEHOLDER = 'Add...';

const NexusMultiInstanceField = ({
    schema,
    existingItems,
    keyForTagLabel,
    isWithInlineEdit,
    isReadOnly,
    onSubmit,
    onConfirm,
    useModal
}) => {
    const [items, setItems] = useState(existingItems);
    const [editIndex, setEditIndex] = useState(-1);
    const [formValue, setFormValue] = useState({});
    const [inlineEdit, setInlineEdit] = useState(null);
    const {setModalContent, setModalActions, close}= useContext(NexusModalContext);

    useEffect(() => setItems(existingItems), [existingItems]);
    useEffect(() => {
        if (!isEmpty(formValue)) {
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

        if(useModal) {
            setModalActions([
                {
                    text: 'Cancel', onClick: () => {
                        setEditIndex(-1);
                        setFormValue({});
                        close();
                    }
                },
                {text: 'Submit', onClick: callback}
            ]);
            setModalContent(content);
        }else{
            setInlineEdit(content);
        }
    };

    // Filters out the item at given index
    const getFilteredItems = (arr = [], index) => arr.filter((element, i) => i !== index);


    // Handler for clicking on the NexusTag to edit existing/added item
    const onEditItem = (item, index) => {
        setEditIndex(index);
        addOrEditItem(item, submitEditedItems);
    };

    // Handler for removing an item form the list via NexusTag's remove button
    const onRemoveItem = (index) => {
        const newItems = getFilteredItems(items, index);
        onSubmit(newItems);
        setItems(newItems);
    };

    const submitEditedItems = () => {
        const itemsClone = items;
        const editedItem = formValue;
        // state prop is used for coloring
        editedItem.state = 'modified';

        itemsClone[editIndex] = editedItem;
        onSubmit(itemsClone);

        setItems(itemsClone);
        setEditIndex(-1);
        setFormValue({});

        if(useModal){
            close();
        }else{
            setInlineEdit(null);
        }
    };

    const submitNewItem = () => {
        const editedItem = formValue;
        // state prop is used for coloring
        editedItem.state = 'new';

        const combinedItems = [...items, editedItem];
        onSubmit(combinedItems);

        setItems(combinedItems);
        setFormValue({});
        if(useModal){
            close();
        }else{
            setInlineEdit(null);
        }
    };

    const MultiInstanceField = (isReadOnly) => (
        <>
            {isReadOnly
                ? (
                    <div className="nexus-c-multi-instance-field__tag-group">
                        {items.map((item) => (
                                <NexusTag
                                    key={uid(item)}
                                    text={item[keyForTagLabel]}
                                    value={item}
                                    tagState={item.state}
                                />
                            ))}
                    </div>
                )
                : (
                    <div className="nexus-c-multi-instance-field">
                        <div className="nexus-c-multi-instance-field__content">
                            <div className="nexus-c-multi-instance-field__clickable-text" onClick={() => {addOrEditItem(formValue, submitNewItem);}}>
                                {!items.length && PLACEHOLDER}
                            </div>
                            <div className="nexus-c-multi-instance-field__tag-group">
                                {items.map((item, index) => (
                                    <NexusTag
                                        key={uid(item)}
                                        text={item[keyForTagLabel]}
                                        value={item}
                                        tagState={item.state}
                                        removeButtonText="Remove"
                                        onClick={() => onEditItem(item, index)}
                                        onRemove={() => onRemoveItem(index)}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="nexus-c-multi-instance-field__controls">
                            <Button onClick={() => addOrEditItem(formValue, submitNewItem)} className="button-fix">
                                <AddIcon />
                            </Button>
                        </div>
                    </div>
                )
            }
        </>
    );

    return (
        <>
            {isWithInlineEdit && !isReadOnly
                ? (<InlineEdit
                    onConfirm={onConfirm}
                    editView={() => MultiInstanceField(false)}
                    readView={() => (
                        <div className="nexus-c-multi-instance-field__tag-group">
                            {existingItems && existingItems.map((item) => {
                                return (
                                    <Fragment key={uid(item)}>
                                        {item.state !== 'new' &&
                                            <NexusTag
                                                text={item[keyForTagLabel]}
                                                value={item}
                                            />
                                        }
                                    </Fragment>
                                );
                            })}
                        </div>
                    )}
                    readViewFitContainerWidth
                    defaultValue={[]}
                />)
                : MultiInstanceField(isReadOnly)
            }
            {inlineEdit}
        </>
    );
};

NexusMultiInstanceField.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    schema: PropTypes.arrayOf(PropTypes.object).isRequired,
    keyForTagLabel: PropTypes.string.isRequired,
    existingItems: PropTypes.arrayOf(PropTypes.object),
    isWithInlineEdit: PropTypes.bool,
    isReadOnly: PropTypes.bool,
    onConfirm: PropTypes.func,
    useModal: PropTypes.bool
};

NexusMultiInstanceField.defaultProps = {
    existingItems: [],
    isWithInlineEdit: false,
    isReadOnly: false,
    onConfirm: () => null,
    useModal: true
};

export default NexusMultiInstanceField;

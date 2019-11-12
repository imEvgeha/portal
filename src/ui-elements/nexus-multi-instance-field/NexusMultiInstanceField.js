// eslint-disable-next-line no-unused-vars
import React, {useState, useContext, useEffect, Fragment} from 'react';
import PropTypes from 'prop-types';
import {renderer} from 'react-forms-processor-atlaskit';
import {Form} from 'react-forms-processor';
import isEmpty from 'lodash.isempty';
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
}) => {
    const [items, setItems] = useState(existingItems);
    const [editIndex, setEditIndex] = useState(-1);
    const [formValue, setFormValue] = useState({});
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

        setModalActions([
            {text: 'Cancel', onClick: () => {setEditIndex(-1); setFormValue({}); close();}},
            {text: 'Submit', onClick: callback}
        ]);
        setModalContent(content);
    };

    // Filters out the item at given index
    const getFilteredItems = (arr = [], index) => arr.filter((element, i) => i !== index);

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
        close();
    };

    const submitNewItem = () => {
        const editedItem = formValue;
        // state prop is used for coloring
        editedItem.state = 'new';

        const combinedItems = [...items, editedItem];
        onSubmit(combinedItems);

        setItems(combinedItems);
        setFormValue({});
        close();
    };

    const MultiInstanceField = (isReadOnly) => (
        <>
            {isReadOnly
                ? (
                    <div className="nexus-c-multi-instance-field__tag-group">
                        {items.map((item, index) => (
                                <NexusTag
                                    key={index}
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
                                        key={index}
                                        text={item[keyForTagLabel]}
                                        value={item}
                                        tagState={item.state}
                                        removeButtonText="Remove"
                                        onClick={() => {setEditIndex(index); addOrEditItem(item, submitEditedItems);}}
                                        onRemove={() => {
                                            const newItems = getFilteredItems(items, index);
                                            onSubmit(newItems);
                                            setItems(newItems);
                                        }}
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
                            {items && items.map((item, index) => {
                                return (
                                    <Fragment key={index}>
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
};

NexusMultiInstanceField.defaultProps = {
    existingItems: [],
    isWithInlineEdit: false,
    isReadOnly: false,
    onConfirm: () => null,
};

export default NexusMultiInstanceField;

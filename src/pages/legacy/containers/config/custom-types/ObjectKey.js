// @flow
import React, {Component} from 'react';
import {DragDropContext, Droppable} from 'react-beautiful-dnd';
import {uniqueId} from 'lodash';
import Button from '@atlaskit/button';
import {Form, FormContext} from 'react-forms-processor';
import {Expander} from 'react-forms-processor-atlaskit';
import {Field as AkField} from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';
import InlineEdit from '@atlaskit/inline-edit';
import PropTypes from 'prop-types';

const createFormForItem = (field, item, targetIndex, key, fieldsForForm, formChangeHandler) => {
    const mappedFields = fieldsForForm.map(subfield => ({
        ...subfield,
        id: `${field.id}.${key}.[${targetIndex}]`,
        defaultValue: fieldsForForm.length > 1 ? item[field.name] : item,
    }));
    return (
        <FormContext.Consumer>
            {context => {
                const {renderer, optionsHandler, validationHandler} = context;
                return (
                    <Form
                        parentContext={context}
                        key={`FIELD_${targetIndex}`}
                        defaultFields={mappedFields}
                        renderer={renderer}
                        value={item}
                        optionsHandler={optionsHandler}
                        validationHandler={validationHandler}
                        onChange={formChangeHandler}
                    />
                );
            }}
        </FormContext.Consumer>
    );
};

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'white',
});

export default class ObjectKey extends Component {
    constructor(props) {
        super(props);

        let {defaultValue} = props;
        defaultValue = defaultValue || {};

        // Map the supplied Object to an Item[] in order to give each piece of data an id for drag-and-drop
        const keys = Object.keys(defaultValue);
        const items = keys.map(key => ({
            id: uniqueId(),
            key,
            data: defaultValue[key].map(val => {
                return {id: uniqueId(), data: val};
            }),
        }));
        this.getForm = this.getForm.bind(this);
        this.state = {
            keyName: '',
            items,
        };
    }

    onKeyNameChange(val) {
        this.setState({
            keyName: val,
        });
    }

    addItem = () => {
        let {items, keyName} = this.state;
        items = [...items, {id: uniqueId(), key: keyName, data: []}];
        this.setState({
            items,
            keyName: '',
        });
    };

    addSubItem(itemId) {
        const {items} = this.state;
        const item = items.find(({id}) => id === itemId);
        if (item) {
            item.data.push({id: uniqueId(), data: {}});
        }
        this.setState({
            items,
        });
    }

    removeItem(id) {
        let {items} = this.state;
        items = items.filter(item => item.id !== id);
        this.updateItemState(items);
    }

    removeSubItem(itemId, subId) {
        const {items} = this.state;
        const item = items.find(({id}) => id === itemId);
        if (item) {
            item.data = item.data.filter(subItem => subItem.id !== subId);
        }
        this.updateItemState(items);
    }

    createSubFormChangeHandler(index, index2, fields) {
        return value => {
            const {items} = this.state;
            items[index].data[index2].data = fields.length === 1 ? value[fields[0].name] : value;
            this.updateItemState(items);
        };
    }

    updateItemState(items) {
        this.setState(
            {
                items,
            },
            () => {
                const {onChange} = this.props;
                const {items} = this.state;
                const value = {};
                items.forEach(currentValue => {
                    value[currentValue.key] = currentValue.data.map(rec => rec.data);
                });
                onChange && onChange(value);
            }
        );
    }

    onDragEnd = result => {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const items = reorder(this.state.items, result.source.index, result.destination.index);

        this.updateItemState(items);
    };

    getForm(field, item, index, fields, formChangeHandler, fieldName, parentId, label) {
        const form = createFormForItem(field, item.data, index, label, fields, formChangeHandler);
        if (fields.length > 1) {
            return (
                <Expander
                    key={`exp_${item.id}`}
                    label={item.data[fieldName]}
                    remove={() => {
                        this.removeSubItem(parentId, item.id);
                    }}
                >
                    {form}
                </Expander>
            );
        } else {
            return (
                <div key={`exp_${item.id}`}>
                    <i
                        className="fas fa-times-circle"
                        onClick={() => this.removeSubItem(parentId, item.id)}
                        style={{float: 'right'}}
                    />
                    {form}
                </div>
            );
        }
    }

    checkKeyName(item, value) {
        const collision = this.state.items.find(({key}) => key === value);
        return collision && collision !== item ? 'Duplicate key' : undefined;
    }

    saveKeyName(item, value) {
        item.key = value;
        this.updateItemState(this.state.items);
    }

    getForms() {
        const {items} = this.state;
        const {field, fields, idAttribute} = this.props;

        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                            {items.map((item, index) => {
                                const label = item.key;
                                return (
                                    <Expander
                                        key={`exp_${item.id}`}
                                        label={
                                            <InlineEdit
                                                defaultValue={label}
                                                editView={fieldProps => (
                                                    <Textfield {...fieldProps} autoFocus isCompact />
                                                )}
                                                readView={() => label}
                                                onConfirm={value => this.saveKeyName(item, value)}
                                                validate={value => this.checkKeyName(item, value)}
                                                isRequired
                                                isCompact
                                                hideActionButtons
                                            />
                                        }
                                        remove={() => {
                                            this.removeItem(item.id);
                                        }}
                                    >
                                        {item.data.map((data, index2) => {
                                            const formChangeHandler = this.createSubFormChangeHandler(
                                                index,
                                                index2,
                                                fields
                                            );
                                            return this.getForm(
                                                field,
                                                data,
                                                index2,
                                                fields,
                                                formChangeHandler,
                                                idAttribute,
                                                item.id,
                                                label
                                            );
                                        })}
                                        <Button onClick={() => this.addSubItem(item.id)}>Add</Button>
                                    </Expander>
                                );
                            })}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        );
    }

    render() {
        const {field, label, addButtonLabel, noItemsMessage} = this.props;
        const {items, keyName} = this.state;
        const noItems = <span className="no-items">{noItemsMessage}</span>;

        return (
            <div>
                <AkField label={label} name="formBuilder" isRequired={field.required}>
                    {() => <div>{items.length > 0 ? this.getForms() : noItems}</div>}
                </AkField>
                <div className="d-flex flex-row align-items-start">
                    <Textfield
                        value={keyName}
                        onChange={e => this.onKeyNameChange(e.target.value)}
                        placeholder="Input key name..."
                    />
                    <Button
                        isDisabled={keyName.trim().length === 0 || items.find(({key}) => key === keyName) != null}
                        onClick={this.addItem}
                    >
                        {addButtonLabel}
                    </Button>
                </div>
            </div>
        );
    }
}

ObjectKey.propTypes = {
    defaultValue: PropTypes.any.isRequired,
    onChange: PropTypes.func.isRequired,
    fields: PropTypes.array.isRequired,
    label: PropTypes.string,
    addButtonLabel: PropTypes.string,
    noItemsMessage: PropTypes.string,
    idAttribute: PropTypes.string,
};

ObjectKey.defaultProps = {
    label: 'Item',
    addButtonLabel: 'Add',
    noItemsMessage: 'No items yet',
    idAttribute: 'id',
};

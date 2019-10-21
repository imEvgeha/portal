// @flow
import React, { Component } from 'react';
import { DragDropContext, Droppable} from 'react-beautiful-dnd';
import uniqueId from 'lodash/uniqueId';
import Button from '@atlaskit/button';
import { Form, FormContext } from 'react-forms-processor';
import { Expander } from 'react-forms-processor-atlaskit';
import { Field as AkField } from '@atlaskit/form';
import Textfield  from '@atlaskit/textfield';
import PropTypes from 'prop-types';

const createFormForItem = (
    item,
    targetIndex,
    fieldsForForm,
    formChangeHandler
) => {
    const mappedFields = fieldsForForm.map(field => ({
        ...field,
        id: `${field.id}_${targetIndex}_FIELDS`
    }));
    return (
        <FormContext.Consumer>
            {context => {
                const { renderer, optionsHandler, validationHandler } = context;
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
    background: isDraggingOver ? 'lightblue' : 'white'
});

export default class ObjectKey extends Component {

    constructor(props) {
        super(props);

        const { defaultValue } = props;

        // Map the supplied Object to an Item[] in order to give each piece of data an id for drag-and-drop
        const keys = Object.keys(defaultValue);
        const items = keys.map(key => ({ id: uniqueId(), key:key, data: defaultValue[key].map(val => {return {id: uniqueId(), data: val};}) }));
        this.getForm = this.getForm.bind(this);
        this.state = {
            value: defaultValue,
            keyName: '',
            items
        };
    }

    onKeyNameChange(val){
        this.setState({
            keyName: val
        });
    }

    addItem = () => {
        let { items, keyName} = this.state;
        items = [...items, { id: uniqueId(), key:keyName, data: [] }];
        this.setState({
            items,
            keyName: ''
        });
    }

    addSubItem(itemId){
        let { items } = this.state;
        let item = items.find(({id}) => id === itemId);
        if(item){
            item.data.push({id: uniqueId(), data: {}});
        }
        this.setState({
            items
        });
    }

    removeItem(id) {
        let { items } = this.state;
        items = items.filter(item => item.id !== id);
        this.updateItemState(items);
    }

    removeSubItem(itemId, subId) {
        let { items } = this.state;
        let item = items.find(({id}) => id === itemId);
        if(item){
            item.data = item.data.filter(subItem => subItem.id !== subId);
        }
        this.updateItemState(items);
    }

    createSubFormChangeHandler(index, index2) {
        return (value) => {
            const { items } = this.state;
            items[index].data[index2].data = value;
            this.updateItemState(items);
        };
    }

    updateItemState(items) {
        this.setState(
            {
                items
            },
            () => {
                const { onChange } = this.props;
                const { items } = this.state;
                const value = {};
                items.forEach((currentValue) => {value[currentValue.key] = currentValue.data.map(rec => rec.data);});
                onChange && onChange(value);
            }
        );
    }

    onDragEnd(result) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const items = reorder(
            this.state.items,
            result.source.index,
            result.destination.index
        );

        this.updateItemState(items);
    }

    getForm(item, index, fields, formChangeHandler, fieldName, parentId){
        const form = createFormForItem(
            item.data,
            index,
            fields,
            formChangeHandler
        );
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
    }

    getForms() {
        const { items } = this.state;
        const {
            fields,
            idAttribute,
        } = this.props;

        return (
            <DragDropContext onDragEnd={this.onDragEnd.bind(this)}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}
                        >
                            {items.map((item, index) => {
                                const label = item.key;
                                return (<Expander
                                        key={`exp_${item.id}`}
                                        label={label}
                                        remove={() => {
                                            this.removeItem(item.id);
                                        }}
                                    >
                                        {
                                            item.data.map( (data, index2) => {
                                                const formChangeHandler = this.createSubFormChangeHandler(index, index2);
                                                return this.getForm(data, index2, fields, formChangeHandler, idAttribute, item.id);
                                            })
                                        }
                                        <Button onClick={() => this.addSubItem(item.id)}>{'Add'}</Button>
                                    </Expander>);
                            })}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        );
    }

    render() {
        const {
            label,
            addButtonLabel,
            noItemsMessage
        } = this.props;
        const { items, keyName } = this.state;
        const noItems = <span className="no-items">{noItemsMessage}</span>;

        return (
            <div>
                <AkField label={label} name="formBuilder">
                    {() => <div>{items.length > 0 ? this.getForms() : noItems}</div>}
                </AkField>
                <div className="d-flex flex-row align-items-start">
                    <Button
                        isDisabled={keyName.trim().length === 0}
                        onClick={this.addItem}>{addButtonLabel}
                    </Button>
                    <Textfield
                       value={keyName}
                       onChange={(e) =>  this.onKeyNameChange(e.target.value)}
                    />
                </div>
            </div>
        );
    }
}

ObjectKey.propTypes = {
    defaultValue: PropTypes.any.isRequired,
    onChange:PropTypes.func.isRequired,
    fields: PropTypes.array.isRequired,
    label: PropTypes.string,
    addButtonLabel: PropTypes.string,
    noItemsMessage: PropTypes.string,
    idAttribute: PropTypes.string
};

ObjectKey.defaultProps = {
    label: 'Item',
    addButtonLabel: 'Add',
    noItemsMessage: 'No items yet',
    idAttribute: 'id',
};
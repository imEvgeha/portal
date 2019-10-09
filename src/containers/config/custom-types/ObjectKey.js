// @flow
import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import uniqueId from 'lodash/uniqueId';
import get from 'lodash/get';
import Button from '@atlaskit/button';
import { Form, FormContext } from 'react-forms-processor';
import { Expander } from 'react-forms-processor-atlaskit';
import { Field as AkField } from '@atlaskit/form';
import Textfield  from '@atlaskit/textfield';
// import TextField from '@atlaskit/field-text';

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

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'white',

    // styles we need to apply on draggables
    ...draggableStyle
});

export default class ObjectKey extends Component {

    constructor(props) {
        super(props);

        const { defaultValue } = props;

        // Map the supplied Object to an Item[] in order to give each piece of data an id for drag-and-drop
        const keys = Object.keys(defaultValue);
        const items = keys.map(key => ({ id: uniqueId(), data: defaultValue[key] }));
        this.getForm = this.getForm.bind(this);
        this.state = {
            value: defaultValue,
            keyName: '',
            keys,
            items
        };
    }

    onKeyNameChange(val){
        this.setState({
            keyName: val
        });
    }

    addItem() {
        let { items, keys, keyName} = this.state;
        keys = [...keys, keyName.trim()];
        items = [...items, { id: uniqueId(), data: [] }];
        this.setState({
            items,
            keys,
            keyName: ''
        });
    }

    addSubItem(itemId){
        let { items } = this.state;
        let item = items.find(({id}) => id === itemId);
        if(item){
            item.data.push({});
        }
        this.setState({
            items
        });
    }

    removeItem(id) {
        let { items, keys } = this.state;
        let pos = items.findIndex(item => item.id === id);
        keys.splice(pos, 1);
        items = items.filter(item => item.id !== id);
        this.updateItemState(items);
    }

    removeSubItem(itemId, field, subId) {
        let { items } = this.state;
        let item = items.find(({id}) => id === itemId);
        if(item){
            item.data = item.data.filter(subItem => subItem[field] !== subId);
        }
        this.updateItemState(items);
    }

    createFormChangeHandler(index) {
        return (value) => {
            const { items } = this.state;
            items[index].data = value;
            this.updateItemState(items);
        };
    }

    createSubFormChangeHandler(index, index2) {
        return (value) => {
            const { items } = this.state;
            items[index].data[index2] = value;
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
                const { items, keys } = this.state;
                const value = {};
                items.forEach((currentValue, index) => {value[keys[index]] = currentValue.data;});
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

    getForm(item, index, fields, formChangeHandler, label, field, parentId){
        const form = createFormForItem(
            item.data,
            index,
            fields,
            formChangeHandler
        );
        return (
            <div>
                <Expander
                    key={`exp_${item.id}`}
                    label={label}
                    remove={() => {
                        this.removeSubItem(parentId, field, item.id);
                    }}
                >
                    {form}
                </Expander>
            </div>
        );

        // return (
        //     <Draggable key={item.id} draggableId={item.id} index={index}>
        //         {(provided, snapshot) => (
        //             <div
        //                 ref={provided.innerRef}
        //                  {...provided.draggableProps}
        //                  {...provided.dragHandleProps}
        //                  style={getItemStyle(
        //                      snapshot.isDragging,
        //                      provided.draggableProps.style
        //                  )}
        //             >
        //                 <Expander
        //                     key={`exp_${item.id}`}
        //                     label={label}
        //                     remove={() => {
        //                         this.removeSubItem(parentId, field, item.id);
        //                     }}
        //                 >
        //                     {form}
        //                 </Expander>
        //             </div>
        //         )}
        //     </Draggable>
        // );
    }

    getForms() {
        const { keys, items } = this.state;
        const {
            fields,
            idAttribute = 'id',
            unidentifiedLabel = 'Unidentified item'
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

                                const label = get(keys, index, unidentifiedLabel);
                                if(Array.isArray(item.data)){
                                    return (<div>
                                        <Expander
                                            key={`exp_${item.id}`}
                                            label={label}
                                            remove={() => {
                                                this.removeItem(item.id);
                                            }}
                                        >
                                            {
                                                item.data.map( (data, index2) => {
                                                    const formChangeHandler = this.createSubFormChangeHandler(index, index2);
                                                    return this.getForm({data: data, id:data[idAttribute]}, index2, fields, formChangeHandler, data[idAttribute], idAttribute, item.id);
                                                })
                                            }
                                            <Button onClick={() => this.addSubItem(item.id)}>{'Add'}</Button>
                                        </Expander>
                                    </div>);
                                }else{
                                    const formChangeHandler = this.createFormChangeHandler(index);
                                    return this.getForm(item, index, fields, formChangeHandler, label);
                                }
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
            label = 'Item',
            // description,
            addButtonLabel = 'Add',
            noItemsMessage = 'No items yet'
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
                            onClick={() => this.addItem()}>{addButtonLabel}</Button>
                    <Textfield
                               value={keyName}
                               onChange={(e) =>  this.onKeyNameChange(e.target.value)}/>

                </div>
            </div>
        );
    }
}
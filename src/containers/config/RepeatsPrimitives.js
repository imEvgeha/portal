// @flow
import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import uniqueId from 'lodash/uniqueId';
import Button from '@atlaskit/button';
import { Form, FormContext } from 'react-forms-processor';
import { Field as AkField } from '@atlaskit/form';

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

export default class RepeatsPrimitives extends Component {
    constructor(props) {
        super(props);

        const { defaultValue } = props;

        // Map the supplied array to an Item[] in order to give each piece of data an id for drag-and-drop
        const items = defaultValue.map(data => ({ id: uniqueId(), data }));
        this.state = {
            value: defaultValue,
            items
        };
    }

    addItem() {
        let { items } = this.state;
        items = [...items, { id: uniqueId(), data: '' }];
        // this.updateItemState(items);
        this.setState({
            items
        });
    }

    removeItem(id) {
        let { items } = this.state;
        items = items.filter(item => item.id !== id);
        this.updateItemState(items);
    }

    createFormChangeHandler(index) {
        return (value) => {
            const { items } = this.state;
            items[index].data = value;
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
                const value = items.map(item => item.data);
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

    getForms() {
        const { items } = this.state;
        const {
            fields,
            idAttribute = 'id'
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
                                const formChangeHandler = this.createFormChangeHandler(index);
                                const form = createFormForItem(
                                    {[idAttribute]:item.data},
                                    index,
                                    fields,
                                    formChangeHandler
                                );
                                return (
                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                className="columns"
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={getItemStyle(
                                                    snapshot.isDragging,
                                                    provided.draggableProps.style
                                                )}
                                            >
                                                <div className="container">
                                                    <div className="row">
                                                        <div className="col-md-auto" style={{padding:'0'}}>
                                                            {form}
                                                        </div>
                                                        <div className="col-md-auto" style={{padding:'0', marginTop:'8px'}}>
                                                            <Button onClick={() => {this.removeItem(item.id);}}>X</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
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
        const {
            label = 'Item',
            // description,
            addButtonLabel = 'Add',
            noItemsMessage = 'No items yet'
        } = this.props;
        const { items } = this.state;
        const noItems = <span className="no-items">{noItemsMessage}</span>;

        return (
            <div>
                <AkField label={label} name="formBuilder">
                    {() => <div>{items.length > 0 ? this.getForms() : noItems}</div>}
                </AkField>
                <Button onClick={() => this.addItem()}>{addButtonLabel}</Button>
            </div>
        );
    }
}

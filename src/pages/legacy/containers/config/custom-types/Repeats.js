// @flow
import React, {Component} from 'react';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import {get, uniqueId} from 'lodash';
import Button from '@atlaskit/button';
import {getDir, hebrew} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-dynamic-form/utils';
import {Form, FormContext} from 'react-forms-processor';
import {Expander} from 'react-forms-processor-atlaskit';
import {Field as AkField} from '@atlaskit/form';

const createFormForItem = (field, item, targetIndex, fieldsForForm, formChangeHandler) => {
    const mappedFields = fieldsForForm.map(subfield => ({
        ...subfield,
        id: `${field.id}[${targetIndex}].${subfield.id}`,
        visibleWhen: subfield.visibleWhen
            ? subfield.visibleWhen.map(condition => ({
                  ...condition,
                  field: `${field.id}[${targetIndex}].${condition.field}`,
              }))
            : [],
    }));

    const firstName = document.getElementById(mappedFields[1].id)?.getElementsByTagName('input')[0];
    const middleName = document.getElementById(mappedFields[2].id)?.getElementsByTagName('input')[0];
    const lastName = document.getElementById(mappedFields[3].id)?.getElementsByTagName('input')[0];
    const displayName = document.getElementById(mappedFields[4].id)?.getElementsByTagName('input')[0];

    if (hebrew.test(firstName?.value)) firstName?.setAttribute('dir', getDir(firstName.value));
    if (hebrew.test(middleName?.value)) middleName?.setAttribute('dir', getDir(middleName.value));
    if (hebrew.test(lastName?.value)) lastName?.setAttribute('dir', getDir(lastName.value));
    if (hebrew.test(displayName?.value)) displayName?.setAttribute('dir', getDir(displayName.value));

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

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'white',

    // styles we need to apply on draggables
    ...draggableStyle,
});

export default class Repeats extends Component {
    constructor(props) {
        super(props);

        let {defaultValue} = props;
        defaultValue = defaultValue || [];

        // Map the supplied array to an Item[] in order to give each piece of data an id for drag-and-drop
        const items = defaultValue.map(data => ({id: uniqueId(), data}));
        this.state = {
            items,
        };
    }

    addItem() {
        let {items} = this.state;
        items = [...items, {id: uniqueId(), data: {}}];
        // this.updateItemState(items);
        this.setState({
            items,
        });
    }

    removeItem(id) {
        let {items} = this.state;
        items = items.filter(item => item.id !== id);
        this.updateItemState(items);
    }

    createFormChangeHandler(index) {
        return value => {
            const {items} = this.state;
            items[index].data = value;
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
                const value = items.map(item => item.data);
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

    getForms() {
        const {items} = this.state;
        const {field, fields, idAttribute = 'id', unidentifiedLabel = 'Unidentified item'} = this.props;

        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                            {items.map((item, index) => {
                                const formChangeHandler = this.createFormChangeHandler(index);
                                const form = createFormForItem(field, item.data, index, fields, formChangeHandler);
                                const label = get(item.data, idAttribute, unidentifiedLabel);
                                return (
                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                                            >
                                                <Expander
                                                    key={`exp_${item.id}`}
                                                    label={label}
                                                    remove={() => {
                                                        this.removeItem(item.id);
                                                    }}
                                                >
                                                    {form}
                                                </Expander>
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
            field,
            label = 'Item',
            // description,
            addButtonLabel = 'Add',
            noItemsMessage = 'No items yet',
        } = this.props;
        const {items} = this.state;
        const noItems = <span className="no-items">{noItemsMessage}</span>;

        return (
            <div>
                <AkField label={label} name="formBuilder" isRequired={field.required}>
                    {() => <div>{items.length > 0 ? this.getForms() : noItems}</div>}
                </AkField>
                <Button onClick={() => this.addItem()}>{addButtonLabel}</Button>
            </div>
        );
    }
}

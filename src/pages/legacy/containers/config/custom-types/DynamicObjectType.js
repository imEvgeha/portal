import React, {Component} from 'react';
import {uniqueId} from 'lodash';
import {Form, FormContext} from 'react-forms-processor';
import {Expander} from 'react-forms-processor-atlaskit';
import {Field as AkField} from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';
import InlineEdit from '@atlaskit/inline-edit';
import Button from '@atlaskit/button';
import PropTypes from 'prop-types';

const createFormForItem = (field, item, targetIndex, fieldsForForm, formChangeHandler) => {
    const mappedFields = fieldsForForm.map(subfield => ({
        ...subfield,
        id: `${field.id}[${targetIndex}].${subfield.id}`,
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

export default class DynamicObjectType extends Component {
    constructor(props) {
        super(props);

        let {defaultValue} = props;
        defaultValue = defaultValue || {};
        const keys = Object.keys(defaultValue);
        const items = keys.map(key => ({id: uniqueId(), key, data: defaultValue[key]}));

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

    addItem() {
        let {items, keyName} = this.state;
        items = [...items, {id: uniqueId(), key: keyName, data: {}}];
        this.setState({
            items,
            keyName: '',
        });
    }

    removeItem(id) {
        let {items} = this.state;
        items = items.filter(item => item.id !== id);
        this.updateItemState(items);
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
                    value[currentValue.key] = currentValue.data;
                });
                onChange && onChange(value);
            }
        );
    }

    createFormChangeHandler(index) {
        return value => {
            const {items} = this.state;
            items[index].data = value;
            this.updateItemState(items);
        };
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
        const {field, fields} = this.props;

        return (
            <div>
                {items.map((item, index) => {
                    const formChangeHandler = this.createFormChangeHandler(index);
                    const form = createFormForItem(field, item.data, index, fields, formChangeHandler);
                    const label = item.key;
                    return (
                        <Expander
                            key={`exp_${item.id}`}
                            label={
                                <InlineEdit
                                    defaultValue={label}
                                    editView={fieldProps => <Textfield {...fieldProps} autoFocus isCompact />}
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
                            {form}
                        </Expander>
                    );
                })}
            </div>
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
                        onClick={() => this.addItem()}
                    >
                        {addButtonLabel}
                    </Button>
                </div>
            </div>
        );
    }
}

DynamicObjectType.propTypes = {
    defaultValue: PropTypes.any.isRequired,
    onChange: PropTypes.func.isRequired,
    fields: PropTypes.array.isRequired,
    label: PropTypes.string,
    addButtonLabel: PropTypes.string,
    noItemsMessage: PropTypes.string,
};

DynamicObjectType.defaultProps = {
    label: 'Item',
    addButtonLabel: 'Add',
    noItemsMessage: 'No items yet',
};

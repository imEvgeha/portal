import React, { Component } from 'react';
import uniqueId from 'lodash/uniqueId';
import { Form, FormContext } from 'react-forms-processor';
import { Expander } from 'react-forms-processor-atlaskit';
import { Field as AkField } from '@atlaskit/form';
import Textfield  from '@atlaskit/textfield';
import Button from '@atlaskit/button';
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

export default class DynamicObjectType extends Component {
    constructor(props) {
        super(props);

        const { defaultValue } = props;
        const keys = Object.keys(defaultValue);
        const items = keys.map(key => ({ id: uniqueId(), key:key, data: defaultValue[key] }));

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

    addItem() {
        let { items, keyName} = this.state;
        items = [...items, { id: uniqueId(), key:keyName, data: {} }];
        this.setState({
            items,
            keyName: ''
        });
    }

    removeItem(id) {
        let { items } = this.state;
        items = items.filter(item => item.id !== id);
        this.updateItemState(items);
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
                items.forEach((currentValue) => {value[currentValue.key] = currentValue.data;});
                onChange && onChange(value);
            }
        );
    }

    createFormChangeHandler(index) {
        return (value) => {
            const { items } = this.state;
            items[index].data = value;
            this.updateItemState(items);
        };
    }

    getForms() {
            const { items } = this.state;
            const { fields } = this.props;

            return (
                <div>
                    {items.map((item, index) => {
                        const formChangeHandler = this.createFormChangeHandler(index);
                        const form = createFormForItem(
                            item.data,
                            index,
                            fields,
                            formChangeHandler
                        );
                        const label = item.key;
                        return (
                            <Expander
                                key={`exp_${item.id}`}
                                label={label}
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
        const {
            label,
            addButtonLabel,
            noItemsMessage
        } = this.props;

        const { items, keyName } = this.state;
        const noItems = <span className="no-items">{noItemsMessage}</span>;

        return(
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

DynamicObjectType.propTypes = {
    defaultValue: PropTypes.any.isRequired,
    onChange:PropTypes.func.isRequired,
    fields: PropTypes.array.isRequired,
    label: PropTypes.string,
    addButtonLabel: PropTypes.string,
    noItemsMessage: PropTypes.string
};

DynamicObjectType.defaultProps = {
    label: 'Item',
    addButtonLabel: 'Add',
    noItemsMessage: 'No items yet',
};
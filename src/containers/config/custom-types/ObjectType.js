import React, { Component } from 'react';
import { Form, FormContext } from 'react-forms-processor';
import { Field as AkField } from '@atlaskit/form';
import PropTypes from 'prop-types';

const createFormForItem = (
    item,
    fieldsForForm,
    formChangeHandler
) => {
    const mappedFields = fieldsForForm.map(field => ({
        ...field,
        id: `${field.id}_FIELDS`
    }));
    return (
        <FormContext.Consumer>
            {context => {
                const { renderer, optionsHandler, validationHandler } = context;
                return (
                    <Form
                        parentContext={context}
                        key={'FIELD_0'}
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

export default class ObjectType extends Component {
    constructor(props) {
        super(props);

        const { defaultValue } = props;

        this.state = {
            value: defaultValue
        };
    }

    updateItemState(value) {
        this.setState(
            {
                value
            },
            () => {
                const { onChange } = this.props;
                const { value } = this.state;
                onChange && onChange(value);
            }
        );
    }

    createFormChangeHandler() {
        return (value) => {
            this.updateItemState(value);
        };
    }

    getForms() {
            const {fields} = this.props;
            const {value} = this.state;
            const formChangeHandler = this.createFormChangeHandler();
            const form = createFormForItem(
                value,
                fields,
                formChangeHandler
            );
            return (
                <div>
                    {form}
                </div>
            );
        }

    render() {
        const {label = 'Item'} = this.props;

        return(
            <div>
                <AkField label={label} name="formBuilder">
                    {() => <div>{this.getForms()}</div>}
                </AkField>
            </div>
        );
    }
}

ObjectType.propTypes = {
    defaultValue: PropTypes.func.isRequired,
    onChange:PropTypes.func.isRequired,
    fields: PropTypes.array.isRequired,
    label: PropTypes.string,
    addButtonLabel: PropTypes.string,
    noItemsMessage: PropTypes.string
};
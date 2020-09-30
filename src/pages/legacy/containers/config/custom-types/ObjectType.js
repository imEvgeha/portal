import React, {Component} from 'react';
import {Form, FormContext} from 'react-forms-processor';
import {Field as AkField} from '@atlaskit/form';
import PropTypes from 'prop-types';

const createFormForItem = (field, item, fieldsForForm, formChangeHandler) => {
    const mappedFields = fieldsForForm.map(subfield => ({
        ...subfield,
        id: `${field.id}.${subfield.id}`,
    }));
    return (
        <FormContext.Consumer>
            {context => {
                const {renderer, optionsHandler, validationHandler} = context;
                return (
                    <Form
                        parentContext={context}
                        key="FIELD_0"
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

        const {defaultValue} = props;

        this.state = {
            value: defaultValue,
        };
    }

    updateItemState(value) {
        this.setState(
            {
                value,
            },
            () => {
                const {onChange} = this.props;
                const {value} = this.state;
                onChange && onChange(value);
            }
        );
    }

    createFormChangeHandler() {
        return value => {
            this.updateItemState(value);
        };
    }

    getForms() {
        const {field, fields} = this.props;
        const {value} = this.state;
        const formChangeHandler = this.createFormChangeHandler();
        const form = createFormForItem(field, value, fields, formChangeHandler);
        return <div>{form}</div>;
    }

    render() {
        const {label, field} = this.props;

        return (
            <div>
                <AkField label={label} name="formBuilder" isRequired={field.required}>
                    {() => <div>{this.getForms()}</div>}
                </AkField>
            </div>
        );
    }
}

ObjectType.propTypes = {
    defaultValue: PropTypes.any.isRequired,
    onChange: PropTypes.func.isRequired,
    fields: PropTypes.array.isRequired,
    label: PropTypes.string,
};

ObjectType.defaultProps = {
    label: 'Item',
};

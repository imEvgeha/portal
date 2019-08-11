import React from 'react';
import Button from '@atlaskit/button';
import {Form} from 'react-forms-processor';
import {renderer as akRenderer, FormButton} from 'react-forms-processor-atlaskit';

import RepeatingFormField from './Repeats';
import RepeatingField from './RepeatsPrimitives';

import {isObject} from '../../util/Common';
import {getConfigApiValues} from '../../common/CommonConfigService';
import t from 'prop-types';

const renderer = (
    field,
    onChange,
    onFieldFocus,
    onFieldBlur
) => {
    const { defaultValue = [], id, label, type, value, misc = {} } = field;

    const fields = misc.fields || [];
    const singleField = fields.length === 1;
    const RepeatingComp = singleField ? RepeatingField : RepeatingFormField;

    const addButtonLabel = misc.addButtonLabel;
    const unidentifiedLabel = misc.unidentifiedLabel;
    const noItemsMessage = misc.noItemsMessage;
    const idAttribute = misc.idAttribute;

    switch (type) {
        case 'repeating':
            return (
                <RepeatingComp
                    key={id}
                    addButtonLabel={addButtonLabel}
                    defaultValue={value || defaultValue}
                    label={label}
                    onChange={value => {
                        let val = singleField ?
                            value.map((v) => isObject(v)?v[idAttribute]:v)
                            : value;
                        onChange(id, val);
                    }}
                    fields={fields}
                    unidentifiedLabel={unidentifiedLabel}
                    noItemsMessage={noItemsMessage}
                    idAttribute={idAttribute}
                />
            );

        default:
            return akRenderer(field, onChange, onFieldFocus, onFieldBlur);
    }
};

export default class CreateEditConfigForm extends React.Component {

    static propTypes = {
        value: t.any,
        schema: t.object,
        onCancel: t.func,
        onSubmit: t.func
    };

    constructor(props) {
        super(props);
        this.state={
            value: this.props.value
        };
        this.optionsHandler = this.optionsHandler.bind(this);
    }

    optionsHandler(fieldId, fields) {
        let field = fields.find(({id}) => id === fieldId);
        if(field){
            if((field.type === 'select' || field.type === 'multiselect') && field.sourceAPI){
                return getConfigApiValues(field.sourceAPI, 0, 1000).then(response => {
                    const items = response.data.data.map(rec => rec[field.sourceField]);
                    return [
                        {
                            items
                        }
                    ];
                });
            }
        }
        return null;
    }

    render() {
        return (
            <Form renderer = {renderer}
                  defaultFields={this.props.schema}
                  optionsHandler={this.optionsHandler}
                  value = {this.state.value}
                  onChange = {(value) => this.setState({value: value})}
            >
                <Button onClick={this.props.onCancel}>Cancel</Button>
                <FormButton onClick={this.props.onSubmit}/>
            </Form>
        );
    }
}
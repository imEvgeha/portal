import React from 'react';
import {Form} from 'react-forms-processor';
import {renderer as akRenderer, FormButton, FieldDefinitionField} from 'react-forms-processor-atlaskit';

import RepeatingFormField from './Repeats';

const renderer = (
    field,
    onChange,
    onFieldFocus,
    onFieldBlur
) => {
    const { defaultValue = [], id, label, type, misc = {} } = field;
    switch (type) {
        case 'repeating':
            const fields = misc.fields || [];
            const addButtonLabel = misc.addButtonLabel;
            const unidentifiedLabel = misc.unidentifiedLabel;
            const noItemsMessage = misc.noItemsMessage;
            const idAttribute = misc.idAttribute;
            return (
                <RepeatingFormField
                    key={id}
                    addButtonLabel={addButtonLabel}
                    defaultValue={defaultValue}
                    label={label}
                    onChange={value => onChange(id, value)}
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

const getOptions = (path) => {
    let proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    return fetch(proxyUrl + path)
        .then(response => response.json())
        .then(json => {
            const items = json.results.map(character => character.name);
            const options = [
                {
                    items
                }
            ];
            return options;
        });
};

export default class CreateEditConfigForm extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            value: this.props.value
        }
        this.optionsHandler = this.optionsHandler.bind(this);
    }

    optionsHandler(fieldId, fields, parentContext) {
        switch (fieldId) {
            case "permutations2":
                return getOptions('https://swapi.co/api/people/');
            default: {
                return null;
            }
        }
    }

    render() {
        return (
            <Form renderer = {renderer}
                  defaultFields={this.props.defaultFields}
                  optionsHandler={this.optionsHandler}
                  value = {this.state.value}
                  onChange = {(value) => this.setState({value: value})}
            >
                <FormButton onClick={this.props.onSubmit}/>
            </Form>
        )
    }
}
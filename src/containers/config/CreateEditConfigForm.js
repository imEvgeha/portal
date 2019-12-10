import React from 'react';
import Button from '@atlaskit/button';
import {Form} from 'react-forms-processor';
import {renderer as akRenderer, FormButton} from 'react-forms-processor-atlaskit';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from 'reactstrap';

import RepeatingFormField from './custom-types/Repeats';

import RepeatingField from './custom-types/RepeatsPrimitives';

import {isObject} from '../../util/Common';
import {getConfigApiValues} from '../../common/CommonConfigService';
import {cache} from './EndpointContainer';
import PropTypes from 'prop-types';
import DynamicObjectType from './custom-types/DynamicObjectType';
import ObjectType from './custom-types/ObjectType';
import ObjectKey from './custom-types/ObjectKey';

const DelayedOptions = ({field, onChange, onFieldFocus, onFieldBlur}) => {
    if(field.options && Array.isArray(field.options) && field.options.length && field.options[0] && field.options[0].items && !field.options[0].items.includes(field.value)){
        const val = field.options[0].items.find(option => JSON.stringify(option.value) === JSON.stringify(field.value));
        //find object with same values inside as field.value, replace reference in value with new one from options.
        //this is necessary because select uses '===' on.value of each options to determine the current one. works ok with primitives (because it checks values)
        //doesn't work with nonprimitives where operator '===' checks references, thats why we need this trick.
        if(val){
            field.value = val.value;
        }
    }
    return (<div>
        {
            field.options && field.options.length > 0 ?
            akRenderer(field, onChange, onFieldFocus, onFieldBlur)
            :
            'Loading...'
        }
    </div>);
};

DelayedOptions.propTypes = {
    field: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    onFieldFocus: PropTypes.func,
    onFieldBlur: PropTypes.func
};

const renderer = (
    field,
    onChange,
    onFieldFocus,
    onFieldBlur
) => {
    const { defaultValue, id, label, type, value, dynamic = false, misc = {} } = field;
    if(field.hasOwnProperty('disable')) {
        field.disabled = field.disable;
    }

    const fields = misc.fields || [];
    const singleField = fields.length === 1;
    let Comp;

    const addButtonLabel = misc.addButtonLabel;
    const unidentifiedLabel = misc.unidentifiedLabel;
    const noItemsMessage = misc.noItemsMessage;
    const idAttribute = misc.idAttribute;

    switch (type) {
        case 'array':
            Comp = dynamic === true ? ObjectKey : (singleField ? RepeatingField : RepeatingFormField);
            return (
                <Comp
                    key={id}
                    addButtonLabel={addButtonLabel}
                    defaultValue={value || defaultValue || []}
                    label={label}
                    onChange={value => {
                        let val = singleField && Array.isArray(value)?
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
        case 'object':
            Comp = dynamic === true ? DynamicObjectType : ObjectType;

            return (
                <Comp
                    key={id}
                    addButtonLabel={addButtonLabel}
                    defaultValue={value || defaultValue || []}
                    label={label}
                    onChange={value => {
                        onChange(id, value);
                    }}
                    fields={fields}
                    unidentifiedLabel={unidentifiedLabel}
                    noItemsMessage={noItemsMessage}
                    idAttribute={idAttribute}
                />
            );
        case 'select':
        case 'multiselect':
            return <DelayedOptions key={id} field={field} onChange={onChange} onFieldFocus={onFieldFocus} onFieldBlur={onFieldBlur}/>;
        default:
            return akRenderer(field, onChange, onFieldFocus, onFieldBlur);
    }
};

export default class CreateEditConfigForm extends React.Component {

    static propTypes = {
        label: PropTypes.string,
        value: PropTypes.any,
        schema: PropTypes.array,
        onCancel: PropTypes.func,
        onSubmit: PropTypes.func,
        onRemoveItem: PropTypes.func,
        displayName: PropTypes.string
    };

    constructor(props) {
        super(props);
        this.state={
            value: this.props.value,
            dropdownOpen: false
        };
        this.optionsHandler = this.optionsHandler.bind(this);
    }

    convertDataToOption = (dataSource, schema) => {
        let label, value;
        const {displayValueDelimiter = ' / '} = schema;
        if(Array.isArray(schema.label) && schema.label.length > 1){
            label = schema.label.map(fieldName => dataSource[fieldName]).join(displayValueDelimiter);
        }else{
            label = dataSource[schema.label || schema.value];
        }
        if(Array.isArray(schema.value) && schema.value.length > 1){
            value = schema.value.reduce(function(result, item){
                result[item] = dataSource[item];
                return result;
            }, {});
        }else{
            value = dataSource[schema.value];
        }
        return {label, value};
    };

    processOptions = (rawOptions, field) => {
        const items = rawOptions.map(rec => this.convertDataToOption(rec, field.source));
        return [{items}];
    };

    optionsHandler(fieldId, fields) {
        let field = fields.find(({id}) => id === fieldId);
        if(field){
            if((field.type === 'select' || field.type === 'multiselect') && field.source){
                if(cache[field.source.url] === undefined){
                    const promise = getConfigApiValues(field.source.url, 0, 1000).then(response => {
                        cache[field.source.url] = response.data.data;
                        return this.processOptions(response.data.data, field);
                    });
                    cache[field.source.url] = promise;
                    return promise;
                }else if(cache[field.source.url]){
                    if(cache[field.source.url] instanceof Promise){
                        return cache[field.source.url].then(()=> {});
                    }
                    return this.processOptions(cache[field.source.url], field);
                }else{
                    console.error('Cannot load dropdown values from: ', field.source.url);
                }
            }else{
                if (field.type === 'array' || field.type === 'object'){
                    field.misc.fields.forEach(subfield => this.optionsHandler(subfield.id, field.misc.fields));
                }
            }
        }
        return null;
    }

    handleDeleteItem = (item) => {
        this.props.onRemoveItem(item);
        this.props.onCancel();
    }

    toggle = () => {
        this.setState(previousState => ({
            dropdownOpen: !previousState.dropdownOpen
        }));
    }

    render() {
        return (
                <Modal isOpen={!!this.props.value} toggle={this.props.onCancel} style={{paddingLeft: '30px'}}>
                <ModalBody>                    
                    <p><b style={{color: '#999', fontSize: '13px'}}>{this.props.displayName}</b></p>
                    <p style={{marginTop: '-20px'}}><b>{this.props.value && this.props.label ? this.props.label : <i style={{fontSize: '20px', color: '#666'}}>New {this.props.displayName}</i>}</b></p>
                    {Object.entries(this.props.value).length !== 0 && (                        
                        <div style={{position: 'absolute', top: '20px', right: '20px', cursor: 'pointer'}}>
                        <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                            <DropdownToggle color="light">
                                <b>...</b>
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem onClick={() => this.handleDeleteItem(this.props.value)}>Delete</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        </div>
                    )}
                    <Form 
                        renderer = {renderer}
                        defaultFields={this.props.schema}
                        optionsHandler={this.optionsHandler}
                        value = {this.state.value}
                        onChange = {(value) => this.setState({value: value})}
                    >                        
                    <ModalFooter>
                        <Button onClick={this.props.onCancel}>Cancel</Button>
                        <FormButton onClick={this.props.onSubmit}/>
                    </ModalFooter>
                    </Form>
                </ModalBody>
                </Modal>
        );
    }
}
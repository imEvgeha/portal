import React from 'react';
import Button from '@atlaskit/button';
import {Form} from 'react-forms-processor';
import {renderer as akRenderer, FormButton} from 'react-forms-processor-atlaskit';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from 'reactstrap';

import RepeatingFormField from './Repeats';
import RepeatingField from './RepeatsPrimitives';

import {isObject} from '../../util/Common';
import {getConfigApiValues} from '../../common/CommonConfigService';
import {cache} from './EndpointContainer';
import PropTypes from 'prop-types';

const renderer = (
    field,
    onChange,
    onFieldFocus,
    onFieldBlur
) => {
    const { defaultValue, id, label, type, value, misc = {} } = field;
    if(field.hasOwnProperty('disable')) {
        field.disabled = field.disable;
    }

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
                    defaultValue={value || defaultValue || []}
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

    optionsHandler(fieldId, fields) {
        let field = fields.find(({id}) => id === fieldId);
        if(field){
            if((field.type === 'select' || field.type === 'multiselect') && field.source){
                if(cache[field.source.url]) {
                    const items = cache[field.source.url].map(rec => {return {value: rec[field.source.value], label: rec[field.source.label]};});
                    return [{items}];
                }
                return getConfigApiValues(field.source.url, 0, 1000).then(response => {
                    cache[field.source.url] = response.data.data;

                    const items = response.data.data.map(rec => {return {value: rec[field.source.value], label: rec[field.source.label]};});
                    return [{items}];
                });
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
                    <p style={{marginTop: '-20px'}}><b>{this.props.value && this.props.value.name ? this.props.value.name : <i style={{fontSize: '20px', color: '#666'}}>New {this.props.displayName}</i>}</b></p>
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
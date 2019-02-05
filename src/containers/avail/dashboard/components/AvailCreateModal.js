import React from 'react';
import {Component} from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {ModalFooter, ModalHeader, Modal, Button, Label, Input, Progress} from 'reactstrap';
import t from 'prop-types';
import {availService} from '../../service/AvailService';
import {rangeValidation} from '../../../../util/Validation';
import NexusDatePicker from '../../../../components/form/NexusDatePicker';
import config from 'react-global-configuration';
import {INVALID_DATE} from '../../../../constants/messages';

class AvailCreate extends React.Component {
    static propTypes = {
        className: t.string,
        abortLabel: t.string,
        confirmLabel: t.string,
        reject: t.func,
        resolve: t.func,
        availsMapping: t.any,
    };

    static defaultProps = {
        ...Component.defaultProps,
        confirmLabel: 'Submit',
        abortLabel: 'Cancel',
    };

    constructor(props) {
        super(props);
        this.state = {
            resolutionValidation: config.get('extraValidation.resolution'),
            modal: true,
            showCreatedMessage: false,
            loading: false,
            errorMessage: '',
            mappingErrorMessage: {},
            avail: {}
        };

        this.toggle = this.toggle.bind(this);
        this.abort = this.abort.bind(this);
        this.confirm = this.confirm.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.checkAvail = this.checkAvail.bind(this);
        this.validateTextField = this.validateTextField.bind(this);
        this.handleInvalidDatePicker = this.handleInvalidDatePicker.bind(this);
        this.handleDatepickerChange = this.handleDatepickerChange.bind(this);
    }

    componentDidMount() {
        this.addMappingToState(this.props.availsMapping.mappings);
    }

    handleInvalidDatePicker(name, invalid) {
        const mappingErrorMessage = Object.assign({}, this.state.mappingErrorMessage);
        const groupedMappingName = this.getGroupedMappingName(name);
        if (invalid) {
            mappingErrorMessage[name] = {date: INVALID_DATE};
            if(mappingErrorMessage[groupedMappingName] && mappingErrorMessage[groupedMappingName].range) {
                mappingErrorMessage[groupedMappingName].range = '';
            }
        } else {
            mappingErrorMessage[name] = {...mappingErrorMessage[name], date: ''};
        }
        this.setState({
            mappingErrorMessage: mappingErrorMessage
        });
    }

    handleChange({target}) {
        if(this.state.resolutionValidation.fields.indexOf(target.name) > -1 && target.type !== 'checkbox' && target.value !== ''){
            target.value = target.value.toUpperCase();
        }
        const value = target.type === 'checkbox' ? target.checked : (target.value ? target.value.trim() : '');
        const name = target.name;


        if(this.state.resolutionValidation.type === 'oneOf'){
            if(this.state.resolutionValidation.fields.indexOf(name) > -1){
                this.validateFields(this.state.resolutionValidation.fields, name, value);
            }else{
                this.checkAvail(name, value, null, true);
            }
        }
    }

    checkAvail(name, value, mappingErrorMessage, setNewValue, overrideField, overrideValue) {
        let validationError = this.validateTextField(name, value, overrideField, overrideValue);

        let errorMessage = {range: '', date: '', text: validationError};

        let newAvail = {...this.state.avail, [name]: value};

        if(setNewValue){
            this.setState({
                avail: newAvail,
            });
        }

        if(!mappingErrorMessage){
            this.setState({
                mappingErrorMessage: {...this.state.mappingErrorMessage, [name]: errorMessage}
            });

            this.anyInvalidField(newAvail, this.state.mappingErrorMessage);
        }else{
            mappingErrorMessage[name] = errorMessage;
        }
    }

    handleDatepickerChange(name, displayName, date) {
        const newAvail = {...this.state.avail};
        newAvail[name] = date;
        const groupedMappingName = this.getGroupedMappingName(name);
        const mappingErrorMessage = this.state.mappingErrorMessage;

        if (mappingErrorMessage[groupedMappingName] && !mappingErrorMessage[groupedMappingName].date) {
            const errorMessage = rangeValidation(name, displayName, date, this.state.avail);
            mappingErrorMessage[name].range = errorMessage;
            if (mappingErrorMessage[groupedMappingName]) {
                mappingErrorMessage[groupedMappingName].range = errorMessage;
            }
        }

        this.setState({
            avail: newAvail,
            mappingErrorMessage: mappingErrorMessage
        });
    }

    getGroupedMappingName(name) {
        return name.endsWith('Start') ? name.replace('Start', 'End') : name.replace('End', 'Start');
        }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    abort() {
        return this.props.reject();
    }

    anyInvalidField(avail, mappingErrorMessage) {
        if (this.isAnyErrors(mappingErrorMessage) || this.areMandatoryFieldsEmpty(avail)) {
            return true;
        } else {
            return false;
        }
    }

    isAnyErrors(mappingErrorMessage) {
        for (const [, value] of Object.entries(mappingErrorMessage)) {
            if(value.date) {
                return true;
            }
            if(value.range) {
                return true;
            }
            if(value.text) {
                return true;
            }
        }
        return false;
    }

    validateNotEmpty(data) {
        if (!data || !data.trim()) {
            return 'Field can not be empty';
        }
        return '';
    }

     isAcceptable(data, acceptedValues){
        if(data && acceptedValues && acceptedValues.indexOf(data.trim()) > -1){
            return true;
        }
        return false;
    }

    validateTextField(name, value, overrideField, overrideValue) {
        for(let i=0; i < this.props.availsMapping.mappings.length; i++){
            let mapping = this.props.availsMapping.mappings[i];
            if(mapping.javaVariableName === name) {

                if(this.state.resolutionValidation.type === 'oneOf'){
                    if(this.state.resolutionValidation.fields.indexOf(mapping.javaVariableName) > -1){
                        //if this field belongs to 'oneOf' extra validation
                        let stillInvalid = true; //is presumed invalid until one valid value is found
                        for(let j=0; j < this.state.resolutionValidation.fields.length; j++){
                            if(overrideField && overrideValue && overrideField === this.state.resolutionValidation.fields[j]){
                                if(this.state.resolutionValidation.values == null || j >=  this.state.resolutionValidation.values.length || this.state.resolutionValidation.values[j] == null){
                                    //if no required value just check against empty
                                    if(this.validateNotEmpty(overrideValue) === '') stillInvalid = false;
                                }else{
                                    //if the oneOf element has at least one acceptable value
                                    if(overrideField !== name){
                                         //if is another oneOf element from same group
                                        if(this.isAcceptable(overrideValue, this.state.resolutionValidation.values[j])) stillInvalid=false;
                                    }else{
                                       //if is current field
                                       if(this.isAcceptable(value, this.state.resolutionValidation.values[j])) return '';
                                       //if not acceptable but also not empty
                                       if(this.validateNotEmpty(value)==='') return 'Only ' + this.state.resolutionValidation.values[j].join(', ') + ' or empty values are allowed';
                                    }
                                }
                            }else{
                                if(this.state.resolutionValidation.values == null || j >=  this.state.resolutionValidation.values.length || this.state.resolutionValidation.values[j] == null){
                                    //if no required value just check against empty
                                    if(this.validateNotEmpty(this.state.avail[this.state.resolutionValidation.fields[j]]) === '') stillInvalid = false;
                                }else{
                                    //if the oneOf element has at least one acceptable value
                                    if(this.state.resolutionValidation.fields[j] !== name){
                                         //if is another oneOf element from same group
                                        if(this.isAcceptable(this.state.avail[this.state.resolutionValidation.fields[j]], this.state.resolutionValidation.values[j])) stillInvalid=false;
                                    }else{
                                       //if is current field
                                       if(this.isAcceptable(value, this.state.resolutionValidation.values[j])) return '';
                                       //if not acceptable but also not empty
                                       if(this.validateNotEmpty(value)==='') return 'Only ' + this.state.resolutionValidation.values[j].join(', ') + ' or empty values are allowed';
                                    }
                                }
                            }
                        }

                        if(stillInvalid)return 'At least one of the ' + this.state.resolutionValidation.values.join(', ').toUpperCase() + ' needs to have correct value';
                        else return '';
                    }
                }
                if(mapping.required) return this.validateNotEmpty(value);
            }

        }
        return '';
    }

    areMandatoryFieldsEmpty(avail) {
        //only one extra validation for now, can be extended to multiple validation later if necessary
        switch (this.state.resolutionValidation.type) {
            case 'oneOf' : {
                for(let i=0; i < this.props.availsMapping.mappings.length; i++){
                    let mapping = this.props.availsMapping.mappings[i];
                    //check fields not belonging to 'oneOf' validations
                    //return true and get out as soon as one mandatory field is found not valid
                    if(mapping.required && this.state.resolutionValidation.fields.indexOf(mapping.javaVariableName) === -1 && !avail[mapping.javaVariableName]) return true;
                }
            }
        }

        //check fields belonging to 'oneOf'
        if(this.state.resolutionValidation.type === 'oneOf'){
            let stillInvalid = true; //is presumed invalid until one valid value is found
            for(let i=0; i < this.state.resolutionValidation.fields.length && stillInvalid; i++){
                //check each value to corresponding accepted values (or not empty) and get out when found one valid value
                if(this.state.resolutionValidation.values == null || i >=  this.state.resolutionValidation.values.length || this.state.resolutionValidation.values[i] == null){
                    //if no required value just check against empty
                    if(avail[this.state.resolutionValidation.fields[i]]) stillInvalid = false;
                }else{
                    //if accepted values exists check if current value is among them
                    if(this.state.resolutionValidation.values[i].indexOf(avail[this.state.resolutionValidation.fields[i]]) > -1) stillInvalid = false;
                }
            }

            if(stillInvalid) return true;
        }

        return false;
    }

    validateFields(fields, overrideField, overrideValue){
        let mappingErrorMessage = Object.assign({}, this.state.mappingErrorMessage);
        if(overrideField){
            this.checkAvail(overrideField, overrideValue, mappingErrorMessage, true);
        }
        this.props.availsMapping.mappings.map((mapping) => {
            if(mapping.dataType === 'date') return;
            if(!fields || (fields && fields.indexOf(mapping.javaVariableName) >- 1)){
                if(!overrideField || (overrideField && overrideField !== mapping.javaVariableName)){
                    this.checkAvail(mapping.javaVariableName, this.state.avail[mapping.javaVariableName], mappingErrorMessage, false, overrideField, overrideValue);
                }
            }
        });

        this.setState({
            mappingErrorMessage: mappingErrorMessage
        });

        let newAvail = {...this.state.avail};
        if(overrideField && overrideValue){
            newAvail[overrideField] = overrideValue;
        }
        return this.anyInvalidField(newAvail, mappingErrorMessage);
    }

    confirm() {
        if(this.validateFields()) return;
        this.setState({loading: true, showCreatedMessage: false});
        availService.createAvail(this.state.avail).then(() => {
            this.setState({loading: false, showCreatedMessage: true});
            let thatAbort = this.abort;
            setTimeout(function () {
                thatAbort();
            }, 1000);
        })
            .catch(() => this.setState({loading: false, errorMessage: 'Avail creation Failed'}));
        return this.props.resolve();
    }

    addMappingToState = (mappings) => {
        let mappingErrorMessage = {};
        mappings.map((mapping) => {
            mappingErrorMessage[mapping.javaVariableName] =  {
                date: '',
                range: '',
                text:''
            };
        });

        this.setState({mappingErrorMessage: mappingErrorMessage});
    };

    render() {
        const rowsOnLeft = this.props.availsMapping.mappings.length/2;

        const renderFieldTemplate = (name, displayName, required, content) => {
            return (
                <a href="#" key={name}
                   className="list-group-item list-group-item-action flex-column align-items-start">
                    <div className="row">
                        <div className="col-4">{displayName}{required?<span className="text-danger">*</span>:''}:</div>
                        <div className="col">
                            {content}
                        </div>
                    </div>
                </a>
            );
        };

        const renderTextField = (name, displayName, required) => {
            return renderFieldTemplate(name, displayName, required, (
                <div>
                <Input type="text" name={name} id={'dashboard-avails-create-modal-' + name + '-text'} placeholder={'Enter ' + displayName} onChange={this.handleChange}/>
                {this.state.mappingErrorMessage[name] && this.state.mappingErrorMessage[name].text &&
                    <small className="text-danger m-2">
                        {this.state.mappingErrorMessage[name] ? this.state.mappingErrorMessage[name].text ? this.state.mappingErrorMessage[name].text : '' : ''}
                    </small>
                }
                </div>
            ));
        };

        const renderBooleanField = (name, displayName, required) => {
            return renderFieldTemplate(name, displayName, required, (
                <select className="form-control"
                        name={name}
                        id={'dashboard-avails-create-modal-' + name + '-select'}
                        placeholder={'Enter ' + displayName}
                        value={this.state.avail[name]}
                        onChange={this.handleChange}>
                    <option value="">None selected</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </select>
            ));
        };

        const renderDatepickerField = (name, displayName, required) => {
            return renderFieldTemplate(name, displayName, required, (
                <div>
                    <NexusDatePicker
                    id={'dashboard-avails-create-modal-' + name + '-text'}
                        date={this.state.avail[name]}
                    onChange={(date) => this.handleDatepickerChange(name, displayName, date)}
                        onInvalid={(invalid) => this.handleInvalidDatePicker(name, invalid)}
                />
                    {this.state.mappingErrorMessage[name] && this.state.mappingErrorMessage[name].date &&
                        <small className="text-danger m-2">
                            {this.state.mappingErrorMessage[name].date}
                        </small>
                    }
                    {this.state.mappingErrorMessage[name] && this.state.mappingErrorMessage[name].range &&
                        <small className="text-danger m-2">
                            {this.state.mappingErrorMessage[name].range}
                        </small>
                    }
                </div>
            ));
        };

        const renderFields = (mappings) => {
            return mappings.map((mapping)=> {
                const excludedFields = ['availId', 'rowEdited'];
                if(excludedFields.indexOf(mapping.javaVariableName) === -1){
                    let required = mapping.required && this.state.resolutionValidation.fields.indexOf(mapping.javaVariableName) === -1;
                    switch (mapping.dataType) {
                        case 'text' : return renderTextField(mapping.javaVariableName, mapping.displayName, required);
                        case 'number' : return renderTextField(mapping.javaVariableName, mapping.displayName, required);
                        case 'year' : return renderTextField(mapping.javaVariableName, mapping.displayName, required);
                        case 'date' : return renderDatepickerField(mapping.javaVariableName, mapping.displayName, required);
                        case 'boolean' : return renderBooleanField(mapping.javaVariableName, mapping.displayName, required);
                        default:
                            console.warn('Unsupported DataType: ' + mapping.dataType + ' for field name: ' + mapping.displayName);
                    }
                }
            });
        };

        return (
            <Modal isOpen={this.state.modal} toggle={this.toggle} className = { this.props.className + ' lgModalBox' } fade={false} backdrop={false} size={'lg'}>
                <ModalHeader toggle={this.toggle}>Create Avail</ModalHeader>
                <div className={'row'}>
                    <div className={'col-6'}>
                        <div className="nx-stylish list-group">
                            {renderFields(this.props.availsMapping.mappings.slice(0, rowsOnLeft))}
                        </div>
                    </div>
                    <div className={'col-6'}>
                        <div className="nx-stylish list-group">
                            {renderFields(this.props.availsMapping.mappings.slice(rowsOnLeft))}
                        </div>
                    </div>
                </div>
                {this.state.loading && <Progress className={'custom-progress'} animated value={100}/>}
                <ModalFooter>
                    {this.state.showCreatedMessage && <Label id="dashboard-avails-create-modal-error-message"
                           className="text-success w-100">Avails created</Label>}
                    <Label id="dashboard-avails-create-modal-error-message" className="text-danger w-100">
                        {this.state.errorMessage}
                    </Label>
                    <Button id="dashboard-avails-create-modal-create-btn" color="primary" onClick={this.confirm}>{this.props.confirmLabel}</Button>
                    <Button id="dashboard-avails-create-modal-cancel-btn" color="primary" onClick={this.abort}>{this.props.abortLabel}</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export const availCreateModal = {
    open: (onApprove, onCancel, options) => {
        if (options == null) {
            options = {};
        }
        const props = {
            ...options,
            resolve: () => {
                onApprove();
            },
            reject: () => {
                cleanup();
                onCancel();
            }
        };
        const wrapper = document.body.appendChild(document.createElement('div'));
        render(<AvailCreate {...props}/>, wrapper);
        const cleanup = function () {
            unmountComponentAtNode(wrapper);
            return setTimeout(function () {
                return wrapper.remove();
            });
        };
    }
};
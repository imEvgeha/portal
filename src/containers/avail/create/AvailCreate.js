import React from 'react';
import connect from 'react-redux/es/connect/connect';
import t from 'prop-types';

import {updateBreadcrumb} from '../../../stores/actions/index';
import {Button, Input, Label, Progress} from 'reactstrap';
import NexusDatePicker from '../../../components/form/NexusDatePicker';
import {profileService} from '../service/ProfileService';
import {INVALID_DATE} from '../../../constants/messages';
import {rangeValidation} from '../../../util/Validation';
import {availService} from '../service/AvailService';
import config from 'react-global-configuration';

const mapStateToProps = state => {
    return {
        availsMapping: state.root.availsMapping,
    };
};

const mapDispatchToProps = {
    updateBreadcrumb
};

const EXCLUDED_FIELDS = ['availId', 'rowEdited'];

class AvailCreate extends React.Component {

    static propTypes = {
        updateBreadcrumb: t.func,
        availsMapping: t.any
    };

    constructor(props) {
        super(props);

        this.confirm = this.confirm.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            resolutionValidation: config.get('extraValidation.resolution'),
            mappingErrorMessage: {},
            avail: {}
        };
    }

    componentDidMount() {
        profileService.initAvailsMapping();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.availsMapping != this.props.availsMapping) {
            this.addMappingToState(this.props.availsMapping.mappings);
        }
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

        if (!mappingErrorMessage[groupedMappingName].date) {
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
        })
            .catch(() => this.setState({loading: false, errorMessage: 'Avail creation Failed'}));
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
                    <Input type="text" name={name} id={'avails-create-' + name + '-text'} placeholder={'Enter ' + displayName} onChange={this.handleChange}/>
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
                        id={'avails-create-' + name + '-select'}
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
                        id={'avails-create-' + name + '-text'}
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
                if(EXCLUDED_FIELDS.indexOf(mapping.javaVariableName) === -1){
                    let required = mapping.required;
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

        return(
            <div>
                <div className={'list-group'} >
                    <div>
                        <div className="nx-stylish" style={{columns:'3 400px'}}>
                            {this.props.availsMapping ? renderFields(this.props.availsMapping.mappings) : ''}
                        </div>
                    </div>
                </div>
                {this.state.loading && <Progress className={'custom-progress'} animated value={100}/>}
                {this.state.showCreatedMessage && <Label id="avails-create-created-message" className="text-success w-100">Avail created</Label>}
                <Label id="avails-create-error-message" className="text-danger w-100">
                    {this.state.errorMessage}
                </Label>
                {this.props.availsMapping &&
                    < Button id="avails-create-create-btn" color="primary" onClick={this.confirm}>Submit</Button>
                }
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AvailCreate);
import React from 'react';
import connect from 'react-redux/es/connect/connect';
import t from 'prop-types';

import {saveCreateRightForm} from '../../../stores/actions/avail/createright';
import {Button, Input, Label} from 'reactstrap';
import NexusDatePicker from '../../../components/form/NexusDatePicker';
import {profileService} from '../service/ProfileService';
import {INVALID_DATE} from '../../../constants/messages';
import {rangeValidation} from '../../../util/Validation';
import {rightsService} from '../service/RightsService';
import store from '../../../stores/index';
import NexusBreadcrumb from '../../NexusBreadcrumb';
import {AVAILS_DASHBOARD, RIGHT_CREATE} from '../../../constants/breadcrumb';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import Select from 'react-select';
import { AvField, AvForm } from 'availity-reactstrap-validation';
import {safeTrim} from '../../../util/Common';

const mapStateToProps = state => {
    return {
        availsMapping: state.root.availsMapping,
        selectValues: state.root.selectValues,
        storedForm: state.createright.session.form,
    };
};

const mapDispatchToProps = {
    saveCreateRightForm
};

class RightCreate extends React.Component {

    static propTypes = {
        selectValues: t.object,
        saveCreateRightForm: t.func,
        availsMapping: t.any,
        storedForm: t.object
    };

    static contextTypes = {
        router: t.object
    }

    constructor(props) {
        super(props);

        this.confirm = this.confirm.bind(this);
        this.cancel = this.cancel.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeSave = this.handleChangeSave.bind(this);

        this.mappingErrorMessage = {};
        this.right = {};
    }

    componentDidMount() {
        if(NexusBreadcrumb.empty()) NexusBreadcrumb.set(AVAILS_DASHBOARD);

        NexusBreadcrumb.push(RIGHT_CREATE);
        this.right = this.props.storedForm;

        if(this.props.availsMapping){
            this.initMappingErrors(this.props.availsMapping.mappings);
        }else{
            profileService.initAvailsMapping();
        }
    }

    componentWillUnmount() {
        NexusBreadcrumb.pop();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.availsMapping !== this.props.availsMapping) {
            this.initMappingErrors(this.props.availsMapping.mappings);
        }
        if(prevProps.storedForm !== this.props.storedForm){
            this.right = this.props.storedForm;
        }
    }

    handleInvalidDatePicker(name, invalid) {
        const groupedMappingName = this.getGroupedMappingName(name);
        if (invalid) {
            this.mappingErrorMessage[name] = {date: INVALID_DATE};
            if(this.mappingErrorMessage[groupedMappingName] && this.mappingErrorMessage[groupedMappingName].range) {
                this.mappingErrorMessage[groupedMappingName].range = '';
            }
        } else {
            this.mappingErrorMessage[name].date = '';
        }

        this.setState({});
    }

    handleChange({target}) {
        const value = target.type === 'checkbox' ? target.checked : (target.value ? target.value.trim() : '');
        const name = target.name;
        this.checkRight(name, value, true, false);
    }

    handleChangeSave({target}) {
        const value = target.type === 'checkbox' ? target.checked : (target.value ? target.value.trim() : '');
        const name = target.name;
        this.checkRight(name, value, true, true);
    }

    checkRight(name, value, setNewValue, save) {
        const validationError = this.validateField(name, value);

        let errorMessage = {range: '', date: '', text: validationError};
        this.mappingErrorMessage[name] = errorMessage;

        if(setNewValue){
            let newRight = {...this.right, [name]: value};
            this.right = newRight;
            if(save) {
                store.dispatch(saveCreateRightForm(newRight));
            }
        }
    }

    handleDatepickerChange(name, displayName, date) {
        this.checkRight(name, date, true, true);
        if(!this.mappingErrorMessage[name].text) {
            const groupedMappingName = this.getGroupedMappingName(name);

            if (this.mappingErrorMessage[groupedMappingName] && !this.mappingErrorMessage[groupedMappingName].date) {
                const errorMessage = rangeValidation(name, displayName, date, this.right);
                this.mappingErrorMessage[name].range = errorMessage;
                if (this.mappingErrorMessage[groupedMappingName]) {
                    this.mappingErrorMessage[groupedMappingName].range = errorMessage;
                }
            }
        }

        store.dispatch(saveCreateRightForm({...this.right}));
        this.setState({});
    }

    getGroupedMappingName(name) {
        return name.endsWith('Start') ? name.replace('Start', 'End') : name.replace('End', 'Start');
    }

    anyInvalidField() {
        if (this.isAnyErrors() || this.areMandatoryFieldsEmpty()) {
            return true;
        } else {
            return false;
        }
    }

    isAnyErrors() {
        for (const [, value] of Object.entries(this.mappingErrorMessage)) {
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
        if (!data || !safeTrim(data)) {
            return 'Field can not be empty';
        }
        return '';
    }

    validateField(name, value) {
        const map = this.props.availsMapping.mappings.find(x => x.javaVariableName === name);
        if(map && map.required) {
            if(Array.isArray(value)){
                return value.length === 0 ? 'Field can not be empty' : '';
            }
            return this.validateNotEmpty(value);
        }
        return '';
    }

    areMandatoryFieldsEmpty() {
        if(this.props.availsMapping.mappings.find(x => x.required && !this.right[x.javaVariableName])) return true;
        return false;
    }

    validateFields(){
        this.props.availsMapping.mappings.map((mapping) => {
            this.checkRight(mapping.javaVariableName, this.right[mapping.javaVariableName], false);
        });
        this.setState({});
        return this.anyInvalidField();
    }

    confirm() {
        if(this.validateFields()) return;
        rightsService.create(this.right).then((response) => {
            this.right={};
            this.setState({});
            store.dispatch(saveCreateRightForm({}));
            if(response && response.data && response.data.id){
                this.context.router.history.push('/avails/' + response.data.id);
            }
        })
            .catch(() => this.setState({errorMessage: 'Right creation Failed'}));
    }

    cancel(){
        this.context.router.history.push('/avails');
    }

    initMappingErrors = (mappings) => {
        let mappingErrorMessage = {};
        mappings.map((mapping) => {
            mappingErrorMessage[mapping.javaVariableName] =  {
                date: '',
                range: '',
                text:''
            };
        });

        this.mappingErrorMessage =  mappingErrorMessage;
    };

    render() {
        const renderFieldTemplate = (name, displayName, required, content) => {
            return (
                <div key={name}
                   className="list-group-item list-group-item-action"
                    style={{border:'none'}}>
                    <div className="row">
                        <div className="col-4">{displayName}{required?<span className="text-danger">*</span>:''}:</div>
                        <div className="col-8">
                            {content}
                        </div>
                    </div>
                </div>
            );
        };

        const renderStringField = (name, displayName, required, value) => {
            return renderFieldTemplate(name, displayName, required, (
                <div>
                    <Input defaultValue={value} type="text" name={name} id={'right-create-' + name + '-text'} placeholder={'Enter ' + displayName} onChange={this.handleChange} onBlur={this.handleChangeSave}/>
                    {this.mappingErrorMessage[name] && this.mappingErrorMessage[name].text &&
                    <small className="text-danger m-2">
                        {this.mappingErrorMessage[name] ? this.mappingErrorMessage[name].text ? this.mappingErrorMessage[name].text : '' : ''}
                    </small>
                    }
                </div>
            ));
        };

        const renderIntegerField = (name, displayName, required, value) => {
            return renderFieldTemplate(name, displayName, required, (
                <div>
                    <AvForm>
                        <AvField
                                value={value}
                                name={name}
                                id={'right-create-' + name + '-text'}
                                placeholder={'Enter ' + displayName}
                                onChange={this.handleChange}
                                onBlur={this.handleChangeSave}
                                type="text"
                                validate={{number: true}}
                                errorMessage="Please enter a valid number!"
                        />
                    </AvForm>
                    {this.mappingErrorMessage[name] && this.mappingErrorMessage[name].text &&
                    <small className="text-danger m-2">
                        {this.mappingErrorMessage[name] ? this.mappingErrorMessage[name].text ? this.mappingErrorMessage[name].text : '' : ''}
                    </small>
                    }
                </div>
            ));
        };

        const renderDoubleField = (name, displayName, required, value) => {
            return renderFieldTemplate(name, displayName, required, (
                <div>
                    <AvForm>
                        <AvField
                            value={value}
                            name={name}
                            id={'right-create-' + name + '-text'}
                            placeholder={'Enter ' + displayName}
                            onChange={this.handleChange}
                            onBlur={this.handleChangeSave}
                            type="text"
                            validate={{number: true}}
                            errorMessage="Please enter a valid number!"
                        />
                    </AvForm>
                    {this.mappingErrorMessage[name] && this.mappingErrorMessage[name].text &&
                    <small className="text-danger m-2">
                        {this.mappingErrorMessage[name] ? this.mappingErrorMessage[name].text ? this.mappingErrorMessage[name].text : '' : ''}
                    </small>
                    }
                </div>
            ));
        };

        const renderTimeField = (name, displayName, required, value) => {
            return renderFieldTemplate(name, displayName, required, (
                <div>
                    <AvForm>
                        <AvField
                            value={value}
                            name={name}
                            id={'right-create-' + name + '-text'}
                            placeholder={'Enter ' + displayName}
                            onChange={this.handleChange}
                            onBlur={this.handleChangeSave}
                            type="text"
                            validate={{pattern: {value: /^\d{2,3}:[0-5]\d:[0-5]\d$/}}}
                            errorMessage="Please enter a valid number!"
                        />
                    </AvForm>
                    {this.mappingErrorMessage[name] && this.mappingErrorMessage[name].text &&
                    <small className="text-danger m-2">
                        {this.mappingErrorMessage[name] ? this.mappingErrorMessage[name].text ? this.mappingErrorMessage[name].text : '' : ''}
                    </small>
                    }
                </div>
            ));
        };

        const renderMultiSelectField = (name, displayName, required, value) => {
            let options = [];
            if(this.props.selectValues && this.props.selectValues[name]){
                options  = this.props.selectValues[name];
            }

            //fields with enpoints (these have ids)
            const filterKeys = Object.keys(this.right).filter((key) => this.props.availsMapping.mappings.find((x)=>x.javaVariableName === key).configEndpoint);
            let filters = filterKeys.map((key) => this.right[key]).filter(x => (Array.isArray(x) ? x.length : x));

            let filteredOptions = options;
            filters.map(filter => {
                const fieldName = (Array.isArray(filter) ? filter[0].type : filter.type) + 'Id';
                const allowedOptions = Array.isArray(filter) ? filter.map(({id}) => id) : [filter.id];
                filteredOptions = filteredOptions.filter((option) => option[fieldName] ? (allowedOptions.indexOf(option[fieldName]) > -1) : true);
            });

            const allOptions = [
                {
                    label: 'Select All',
                    options: filteredOptions.filter((rec) => (rec.value)).map(rec => { return {...rec,
                        label: rec.label || rec.value,
                        aliasValue:(rec.aliasId ? (options.filter((pair) => (rec.aliasId === pair.id)).length === 1 ? options.filter((pair) => (rec.aliasId === pair.id))[0].value : null) : null)};})
                }
            ];

            let handleOptionsChange = (selectedOptions) => {
                this.checkRight(name, selectedOptions, true, true);
            };

            return renderFieldTemplate(name, displayName, required, (
                <div
                    id={'right-create-' + name + '-multiselect'}
                    key={name}
                    className="react-select-container"
                >
                    <ReactMultiSelectCheckboxes
                        placeholderButtonLabel={'Select ' + displayName + ' ...'}
                        getDropdownButtonLabel={({placeholderButtonLabel, value}) => {
                            if(value && value.length > 0){
                                return (
                                    <div
                                        style={{width:'100%'}}
                                    >
                                        <div
                                            style={{maxWidth:'90%', float:'left', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace:'nowrap'}}
                                        >
                                            {value.map(({value}) => value).join(', ')}
                                        </div>
                                        <div
                                            style={{width:'10%', float:'left', paddingLeft:'5px'}}
                                        >
                                            {' (' + value.length + ' selected)'}
                                        </div>
                                    </div>
                                );
                            }
                            return placeholderButtonLabel;
                        }}
                        options={allOptions}
                        value={value}
                        onChange={handleOptionsChange}
                    />
                    {this.mappingErrorMessage[name] && this.mappingErrorMessage[name].text &&
                    <small className="text-danger m-2">
                        {this.mappingErrorMessage[name] ? this.mappingErrorMessage[name].text ? this.mappingErrorMessage[name].text : '' : ''}
                    </small>
                    }
                </div>
            ));
        };

        const renderSelectField = (name, displayName, required, value) => {
            let options = [];
            let val;
            if(this.props.selectValues && this.props.selectValues[name]){
                options  = this.props.selectValues[name];
            }

            options = options.filter((rec) => (rec.value)).map(rec => { return {...rec,
                label: rec.label || rec.value,
                aliasValue:(rec.aliasId ? (options.filter((pair) => (rec.aliasId === pair.id)).length === 1 ? options.filter((pair) => (rec.aliasId === pair.id))[0].value : null) : null)};});
            
            if(options.length > 0 && value){
                val = value;
                options.unshift({value: '', label: value ? 'Select...' : ''});
            }

            let handleOptionsChange = (option) => {
                this.checkRight(name, option.value ? option : null, true, true);
            };

            return renderFieldTemplate(name, displayName, required, (
                <div
                    id={'right-create-' + name + '-select'}
                    key={name}
                    className="react-select-container"
                >
                    <Select
                        name={name}
                        isSearchable
                        placeholderButtonLabel={'Select ' + displayName + ' ...'}
                        options={options}
                        value={val}
                        onChange={handleOptionsChange}
                    />
                    {this.mappingErrorMessage[name] && this.mappingErrorMessage[name].text &&
                    <small className="text-danger m-2">
                        {this.mappingErrorMessage[name] ? this.mappingErrorMessage[name].text ? this.mappingErrorMessage[name].text : '' : ''}
                    </small>
                    }
                </div>
            ));
        };

        const renderBooleanField = (name, displayName, required, value) => {
            return renderFieldTemplate(name, displayName, required, (
                <select className="form-control"
                        name={name}
                        id={'right-create-' + name + '-select'}
                        placeholder={'Enter ' + displayName}
                        value={value}
                        onChange={this.handleChange}
                        onBlur={this.handleChangeSave}>
                    <option value="">None selected</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </select>
            ));
        };

        const renderDatepickerField = (name, displayName, required, value) => {
            return renderFieldTemplate(name, displayName, required, (
                <div>
                    <NexusDatePicker
                        value={value}
                        id={'right-create-' + name + '-text'}
                        date={this.right[name]}
                        onChange={(date) => this.handleDatepickerChange(name, displayName, date)}
                        onInvalid={(invalid) => this.handleInvalidDatePicker(name, invalid)}
                    />
                    {this.mappingErrorMessage[name] && this.mappingErrorMessage[name].date &&
                    <small className="text-danger m-2">
                        {this.mappingErrorMessage[name].date}
                    </small>
                    }
                    {this.mappingErrorMessage[name] && this.mappingErrorMessage[name].text &&
                    <small className="text-danger m-2">
                        {this.mappingErrorMessage[name].text}
                    </small>
                    }
                    {this.mappingErrorMessage[name] && this.mappingErrorMessage[name].range &&
                    <small className="text-danger m-2">
                        {this.mappingErrorMessage[name].range}
                    </small>
                    }
                </div>
            ));
        };

        const renderFields = [];

        if(this.props.availsMapping) {
            this.props.availsMapping.mappings.map((mapping)=> {
                if(mapping.enableEdit && !mapping.readOnly){
                    let required = mapping.required;
                    const value = this.right ? this.right[mapping.javaVariableName] : '';
                    switch (mapping.dataType) {
                        case 'string' : renderFields.push(renderStringField(mapping.javaVariableName, mapping.displayName, required, value));
                            break;
                        case 'integer' : renderFields.push(renderIntegerField(mapping.javaVariableName, mapping.displayName, required, value));
                            break;
                        case 'double' : renderFields.push(renderDoubleField(mapping.javaVariableName, mapping.displayName, required, value));
                            break;
                        case 'select' : renderFields.push(renderSelectField(mapping.javaVariableName, mapping.displayName, required, value));
                            break;
                        case 'multiselect' : renderFields.push(renderMultiSelectField(mapping.javaVariableName, mapping.displayName, required, value));
                            break;
                        case 'language' : renderFields.push(renderSelectField(mapping.javaVariableName, mapping.displayName, required, value));
                            break;
                        case 'multilanguage' : renderFields.push(renderMultiSelectField(mapping.javaVariableName, mapping.displayName, required, value));
                            break;
                        case 'duration' : renderFields.push(renderStringField(mapping.javaVariableName, mapping.displayName, required, value));
                             break;
                        case 'time' : renderFields.push(renderTimeField(mapping.javaVariableName, mapping.displayName, required, value));
                            break;
                        case 'date' : renderFields.push(renderDatepickerField(mapping.javaVariableName, mapping.displayName, required, value));
                             break;
                         case 'boolean' : renderFields.push(renderBooleanField(mapping.javaVariableName, mapping.displayName, required, value));
                             break;
                        default:
                            console.warn('Unsupported DataType: ' + mapping.dataType + ' for field name: ' + mapping.displayName);
                    }
                }
            });
        }

        return(
            <div>
                <div className="nx-stylish row mt-3 mx-5">
                    <div className="nx-stylish list-group col" style={{overflowY:'scroll', height:'calc(100vh - 220px)'}}>
                        {renderFields}
                    </div>
                </div>
                <Label id="right-create-error-message" className="text-danger w-100 mt-2 ml-5 pl-3">
                    {this.state && this.state.errorMessage}
                </Label>
                {this.props.availsMapping &&
                    <div className="float-right mt-1 mx-5">
                        <Button className="mr-2" id="right-create-submit-btn" color="primary" onClick={this.confirm}>Submit</Button>
                        <Button className="mr-4" id="right-create-cancel-btn" color="primary" onClick={this.cancel}>Cancel</Button>
                    </div>
                }
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RightCreate);
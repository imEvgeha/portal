import React from 'react';
import connect from 'react-redux/es/connect/connect';
import t from 'prop-types';

import store from '../../../stores/index';
import {blockUI} from '../../../stores/actions/index';
import BlockUi from 'react-block-ui';
import {Button, Input, Label} from 'reactstrap';
import NexusDatePicker from '../../../components/form/NexusDatePicker';
import {profileService} from '../service/ProfileService';
import {INVALID_DATE} from '../../../constants/messages';
import {rangeValidation, oneOfValidation} from '../../../util/Validation';
import {rightsService} from '../service/RightsService';
import NexusBreadcrumb from '../../NexusBreadcrumb';
import {AVAILS_DASHBOARD, RIGHT_CREATE} from '../../../constants/breadcrumb';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import Select from 'react-select';
import { AvField, AvForm } from 'availity-reactstrap-validation';
import {momentToISO, safeTrim} from '../../../util/Common';
import RightsURL from '../util/RightsURL';

const mapStateToProps = state => {
    return {
        availsMapping: state.root.availsMapping,
        selectValues: state.root.selectValues,
        blocking: state.root.blocking
    };
};

class RightCreate extends React.Component {

    static propTypes = {
        selectValues: t.object,
        availsMapping: t.any,
        blocking: t.bool
    };

    static contextTypes = {
        router: t.object
    }

    constructor(props) {
        super(props);

        this.confirm = this.confirm.bind(this);
        this.cancel = this.cancel.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.mappingErrorMessage = {};
        this.right = {};
    }

    componentDidMount() {
        if(NexusBreadcrumb.empty()) NexusBreadcrumb.set(AVAILS_DASHBOARD);

        NexusBreadcrumb.push(RIGHT_CREATE);
        this.right = {};

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

    handleChange({target}, val) {
        const value = val || (target.value ? safeTrim(target.value) : '');
        const name = target.name;
        this.checkRight(name, value, true);
    }

    checkRight(name, value, setNewValue) {
        if(!this.mappingErrorMessage[name] || !this.mappingErrorMessage[name].inner) {
            let validationError = this.validateField(name, value, this.right);

            let errorMessage = {inner: '', pair: '', range: '', date: '', text: validationError};
            this.mappingErrorMessage[name] = errorMessage;

            if (!validationError) {
                const pairFieldName = this.getPairFieldName(name);
                if (pairFieldName) {
                    const map = this.props.availsMapping.mappings.find(({javaVariableName}) => javaVariableName === name);
                    const mappingPair = this.props.availsMapping.mappings.find(({javaVariableName}) => javaVariableName === pairFieldName);
                    const oneOfValidationError = oneOfValidation(name, map.displayName, value, pairFieldName, mappingPair.displayName, this.right);
                    if (!this.mappingErrorMessage[name].range) {
                        this.mappingErrorMessage[name].pair = oneOfValidationError;
                    }
                    this.mappingErrorMessage[pairFieldName] = this.mappingErrorMessage[pairFieldName] || {
                        inner: '',
                        pair: '',
                        range: '',
                        date: '',
                        text: ''
                    };

                    if(!this.mappingErrorMessage[pairFieldName].range) {
                        this.mappingErrorMessage[pairFieldName].pair = oneOfValidationError;
                    }
                }
            }
        }

        if(setNewValue){
            let newRight = {...this.right, [name]: value};
            this.right = newRight;
        }
    }

    handleDatepickerChange(name, displayName, date) {
        const mapping = this.props.availsMapping.mappings.find(({javaVariableName}) => javaVariableName === name);
        let val = date;
        if(date && mapping.dataType === 'date') {
            val = momentToISO(date);
        }
        this.checkRight(name, val, true);
        if(!this.mappingErrorMessage[name].text) {
            const groupedMappingName = this.getGroupedMappingName(name);
            if (this.mappingErrorMessage[groupedMappingName] && !this.mappingErrorMessage[groupedMappingName].date) {
                const errorMessage = rangeValidation(name, displayName, date, this.right);
                this.mappingErrorMessage[name].range = errorMessage;
                if (this.mappingErrorMessage[groupedMappingName]) {
                    this.mappingErrorMessage[groupedMappingName].range = errorMessage;
                    if(!errorMessage){
                        this.checkRight(groupedMappingName, this.right[groupedMappingName],false);
                    }
                }
            }
        }

        this.setState({});
    }

    getGroupedMappingName(name) {
        if(name === 'start') return 'end';
        if(name === 'end') return 'start';
        return name.endsWith('Start') ? name.replace('Start', 'End') : name.replace('End', 'Start');
    }

    getPairFieldName(name) {
        switch (name) {
            case 'start': return 'availStart';
            case 'availStart': return 'start';
            case 'end': return 'availEnd';
            case 'availEnd': return 'end';
            default: return '';
        }
    }

    anyInvalidField() {
        if (this.isAnyErrors() || this.areMandatoryFieldsEmpty()) {
            return true;
        } else {
            return false;
        }
    }

    isAnyErrors() {
        for (let [, value] of Object.entries(this.mappingErrorMessage)) {
            if(value.date || value.range || value.text || value.inner || value.pair) {
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
        if(this.validateFields()) {
            this.setState({errorMessage: 'Not all mandatory fields are filled or not all filled fields are valid'});
            return;
        }
        store.dispatch(blockUI(true));
        rightsService.create(this.right).then((response) => {
            this.right={};
            this.setState({});
            if(response && response.data && response.data.id){
                this.context.router.history.push(RightsURL.getRightUrl(response.data.id));
            }
            store.dispatch(blockUI(false));
        })
            .catch(() => {
                this.setState({errorMessage: 'Right creation Failed'});
                store.dispatch(blockUI(false));
            });
    }

    cancel(){
        this.context.router.history.push('/avails');
    }

    initMappingErrors = (mappings) => {
        let mappingErrorMessage = {};
        mappings.map((mapping) => {
            mappingErrorMessage[mapping.javaVariableName] =  {
                inner: '',
                date: '',
                range: '',
                pair: '',
                text:''
            };
        });

        this.mappingErrorMessage =  mappingErrorMessage;
    };

    render() {
        const renderFieldTemplate = (name, displayName, required, tooltip, content) => {
            return (
                <div key={name}
                   className="list-group-item-action"
                    style={{border:'none', position:'relative', display:'block', padding:'0.75rem 1.25rem', marginBottom:'-1px', backgroundColor:'#fff'}}>
                    <div className="row">
                        <div className="col-4">{displayName}{required?<span className="text-danger">*</span>:''}:
                            {tooltip ? <span title={tooltip} style={{color: 'grey'}}>&nbsp;&nbsp;<i className="far fa-question-circle"></i></span> : ''}
                        </div>
                        <div className="col-8">
                            {content}
                        </div>
                    </div>
                </div>
            );
        };

        const renderStringField = (name, displayName, required, value, tooltip) => {
            return renderFieldTemplate(name, displayName, required, tooltip, (
                <div>
                    <Input defaultValue={value} type="text" name={name} id={'right-create-' + name + '-text'} placeholder={'Enter ' + displayName} onChange={this.handleChange}/>
                    {this.mappingErrorMessage[name] && this.mappingErrorMessage[name].text &&
                    <small className="text-danger m-2">
                        {this.mappingErrorMessage[name] ? this.mappingErrorMessage[name].text ? this.mappingErrorMessage[name].text : '' : ''}
                    </small>
                    }
                </div>
            ));
        };

        const renderIntegerField = (name, displayName, required, value) => {
            const validation = {number : true, pattern:{value: /^\d+$/, errorMessage: 'Please enter a valid integer'}};
            const validate = (val, ctx, input, cb) => {
                let isValid = true;

                if(validation && validation.pattern){
                    isValid = val ? validation.pattern.value.test(val) : !required;
                }else if(validation && validation.number) {
                    isValid = !isNaN(val.replace(',','.'));
                }

                if(this.mappingErrorMessage && this.mappingErrorMessage[name]) {
                    if(this.mappingErrorMessage[name].inner && isValid){
                        this.mappingErrorMessage[name].inner = '';
                        this.setState({});
                    }
                    if(!this.mappingErrorMessage[name].inner && !isValid){
                        this.mappingErrorMessage[name].inner = validation.pattern.errorMessage;
                        this.setState({});
                    }
                }
                cb(isValid);
            };
            return renderFieldTemplate(name, displayName, required, null, (
                <div>
                    <AvForm>
                        <AvField
                                value={value}
                                name={name}
                                id={'right-create-' + name + '-text'}
                                placeholder={'Enter ' + displayName}
                                onChange={(ev, val) => {this.handleChange(ev, Number(val));}}
                                type="text"
                                validate={{number: true, async: validate}}
                                errorMessage={validation.pattern.errorMessage}
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

        const renderYearField = (name, displayName, required, value) => {
            const validation = {pattern:{value: /^\d{4}$/, errorMessage: 'Please enter a valid year (4 digits)'}};
            const validate = (val, ctx, input, cb) => {
                let isValid = true;

                if(validation && validation.pattern){
                    isValid = val ? validation.pattern.value.test(val) : !required;
                }else if(validation && validation.number) {
                    isValid = !isNaN(val.replace(',','.'));
                }

                if(this.mappingErrorMessage && this.mappingErrorMessage[name]) {
                    if(this.mappingErrorMessage[name].inner && isValid){
                        this.mappingErrorMessage[name].inner = '';
                        this.setState({});
                    }
                    if(!this.mappingErrorMessage[name].inner && !isValid){
                        this.mappingErrorMessage[name].inner = validation.pattern.errorMessage;
                        this.setState({});
                    }
                }
                cb(isValid);
            };
            return renderFieldTemplate(name, displayName, required, null, (
                <div>
                    <AvForm>
                        <AvField
                            value={value}
                            name={name}
                            id={'right-create-' + name + '-text'}
                            placeholder={'Enter ' + displayName}
                            onChange={this.handleChange}
                            type="text"
                            validate={{async: validate}}
                            errorMessage={validation.pattern.errorMessage}
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
            const validation = {number : true, pattern:{value: /^\d*(\d[.,]|[.,]\d)?\d*$/, errorMessage: 'Please enter a valid number'}}
            const validate = (val, ctx, input, cb) => {
                let isValid = true;

                if(validation && validation.pattern){
                    isValid = val ? validation.pattern.value.test(val) : !required;
                }else if(validation && validation.number) {
                    isValid = !isNaN(val.replace(',','.'));
                }

                if(this.mappingErrorMessage && this.mappingErrorMessage[name]) {
                    if(this.mappingErrorMessage[name].inner && isValid){
                        this.mappingErrorMessage[name].inner = '';
                        this.setState({});
                    }
                    if(!this.mappingErrorMessage[name].inner && !isValid){
                        this.mappingErrorMessage[name].inner = validation.pattern.errorMessage;
                        this.setState({});
                    }
                }
                cb(isValid);
            };
            return renderFieldTemplate(name, displayName, required, null, (
                <div>
                    <AvForm>
                        <AvField
                            value={value}
                            name={name}
                            id={'right-create-' + name + '-text'}
                            placeholder={'Enter ' + displayName}
                            onChange={(ev, val) => {this.handleChange(ev, Number(val.replace(',','.')));}}
                            type="text"
                            validate={{async: validate}}
                            errorMessage={validation.pattern.errorMessage}
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
            return renderFieldTemplate(name, displayName, required, null, (
                <div>
                    <AvForm>
                        <AvField
                            value={value}
                            name={name}
                            id={'right-create-' + name + '-text'}
                            placeholder={'Enter ' + displayName}
                            onChange={this.handleChange}
                            type="text"
                            validate={{pattern: {value: /^([01]?\d|2[0-3]):[0-5]\d:[0-5]\d$/}}}
                            errorMessage="Please enter a valid time! (00:00:00 - 23:59:59)"
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

            //fields with endpoints (these have ids)
            const filterKeys = Object.keys(this.right).filter((key) => {
                const map = this.props.availsMapping.mappings.find((x)=>x.javaVariableName === key);
                return map && map.configEndpoint;
            });
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
                this.checkRight(name, selectedOptions, true);
            };

            return renderFieldTemplate(name, displayName, required, null, (
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
                if(!required) {
                    options.unshift({value: '', label: value ? 'Select...' : ''});
                }
            }

            let handleOptionsChange = (option) => {
                this.checkRight(name, option.value ? option : null, true);
            };

            return renderFieldTemplate(name, displayName, required, null, (
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
            return renderFieldTemplate(name, displayName, required, null, (
                <select className="form-control"
                        name={name}
                        id={'right-create-' + name + '-select'}
                        placeholder={'Enter ' + displayName}
                        value={value}
                        onChange={this.handleChange}>
                    <option value="">None selected</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </select>
            ));
        };

        const renderDatepickerField = (name, displayName, required, value) => {
            return renderFieldTemplate(name, displayName, required, null, (
                <div>
                    <NexusDatePicker
                        id={'right-create-' + name + '-text'}
                        date={value}
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
                    {this.mappingErrorMessage[name] && this.mappingErrorMessage[name].pair &&
                    <small className="text-danger m-2">
                        {this.mappingErrorMessage[name].pair}
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
                        case 'year' : renderFields.push(renderYearField(mapping.javaVariableName, mapping.displayName, required, value));
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
                        case 'duration' : renderFields.push(renderStringField(mapping.javaVariableName, mapping.displayName, required, value,
                            'format: PnYnMnDTnHnMnS. \neg. P3Y6M4DT12H30M5S (three years, six months, four days, twelve hours, thirty minutes, and five seconds)'));
                             break;
                        case 'time' : renderFields.push(renderTimeField(mapping.javaVariableName, mapping.displayName, required, value));
                            break;
                        case 'localdate' : renderFields.push(renderDatepickerField(mapping.javaVariableName, mapping.displayName, required, value));
                            break;
                        case 'date' : renderFields.push(renderDatepickerField(mapping.javaVariableName, mapping.displayName, required, value ? value.substr(0, 10) : value));
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
            <div style={{position: 'relative'}}>
                <BlockUi tag="div" blocking={this.props.blocking}>
                    <div className={'d-inline-flex justify-content-center w-100 position-absolute' + (this.state && this.state.errorMessage ? ' alert-danger' : '')}
                         style={{top:'-20px', zIndex:'1000', height:'25px'}}>
                        <Label id="right-create-error-message">
                            {this.state && this.state.errorMessage}
                        </Label>
                    </div>
                    <div className="nx-stylish row mt-3 mx-5">
                        <div className="nx-stylish list-group col" style={{overflowY:'scroll', height:'calc(100vh - 220px)'}}>
                            {renderFields}
                        </div>
                    </div>
                    {this.props.availsMapping &&
                        <div style={{display:'flex', justifyContent: 'flex-end'}} >
                            <div className="mt-4 mx-5">
                                <Button className="mr-2" id="right-create-submit-btn" color="primary" onClick={this.confirm}>Submit</Button>
                                <Button className="mr-4" id="right-create-cancel-btn" color="primary" onClick={this.cancel}>Cancel</Button>
                            </div>
                        </div>
                    }
                </BlockUi>
            </div>
        );
    }
}

export default connect(mapStateToProps, null)(RightCreate);
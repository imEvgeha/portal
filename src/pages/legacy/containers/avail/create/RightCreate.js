import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import {store} from '../../../../../index';
import {blockUI} from '../../../stores/actions/index';
import BlockUi from 'react-block-ui';
import {Button, Input, Label} from 'reactstrap';
import {profileService} from '../service/ProfileService';
import {INVALID_DATE} from '../../../constants/messages';
import {oneOfValidation, rangeValidation} from '../../../../../util/Validation';
import {rightsService} from '../service/RightsService';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import Select from 'react-select';
import {AvField, AvForm} from 'availity-reactstrap-validation';
import {momentToISO, safeTrim, URL} from '../../../../../util/Common';
import RightsURL from '../util/RightsURL';
import {can, cannot} from '../../../../../ability';

import RightTerritoryForm from '../../../components/form/RightTerritoryForm';
import RightAudioLanguageForm from '../../../components/form/RightAudioLanguageForm';
import NexusDateTimePicker from '../../../../../ui/elements/nexus-date-and-time-elements/nexus-date-time-picker/NexusDateTimePicker';
import NexusDatePicker from '../../../../../ui/elements/nexus-date-and-time-elements/nexus-date-picker/NexusDatePicker';
import TerritoryField from '../components/TerritoryField';
import AudioLanguageField from '../components/AudioLanguageField';
import {AddButton} from '../custom-form-components/CustomFormComponents';
import RightsClashingModal from '../clashing-modal/RightsClashingModal';
import {DATETIME_FIELDS} from '../../../../../util/DateTimeUtils';


const mapStateToProps = state => {
    return {
        availsMapping: state.root.availsMapping,
        selectValues: state.root.selectValues,
        blocking: state.root.blocking
    };
};

class RightCreate extends React.Component {

    constructor(props) {
        super(props);

        this.confirm = this.confirm.bind(this);
        this.cancel = this.cancel.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleBooleanChange = this.handleBooleanChange.bind(this);

        this.mappingErrorMessage = {};
        this.right = {};
        this.state = {
            isRightTerritoryFormOpen: false,
            isRightAudioLanguageFormOpen: false
        };

    }

    componentDidMount() {
        this.right = {};

        if(this.props.availsMapping){
            this.initMappingErrors(this.props.availsMapping.mappings);
        }else{
            profileService.initAvailsMapping();
        }
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

    handleArrayPush = (e, name) => {         
        let newArray;
        if(this.right[name]) {
            newArray = Array.from(this.right[name]);
            newArray = [...newArray, e];
        } else {
            newArray = [e];
        }
        this.checkRight(name, newArray, true);
    }

    handleDeleteObjectFromArray = (value, name, subField) => {
        const newRight = this.right[name] && this.right[name].filter(e => e[subField] !== value);
        this.checkRight(name, newRight, true);
    }

    handleBooleanChange({target}) {
        const value = target.value;
        const name = target.name;
        if(value === ''){
            delete this.right[name];
            this.checkRight(name, value, false);
        }else{
            this.checkRight(name, value === 'true', true);
        }
    }

    checkRight(name, value, setNewValue) {
        if(!this.mappingErrorMessage[name] || !this.mappingErrorMessage[name].inner) {
            const validationError = this.validateField(name, value, this.right);

            const errorMessage = {inner: '', pair: '', range: '', date: '', text: validationError};
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
            const newRight = {...this.right, [name]: value};
            this.right = newRight;
            this.setState({});
        }
    }

    handleDatepickerChange(name, displayName, date) {
        const mapping = this.props.availsMapping.mappings.find(({javaVariableName}) => javaVariableName === name);
        let val = date;
        if(date && mapping.dataType === DATETIME_FIELDS.REGIONAL_MIDNIGHT) {
            val = momentToISO(moment(date).utcOffset(0, true));
        }
        this.checkRight(name, val, true);
        if(!this.mappingErrorMessage[name].text) {
            const groupedMappingName = this.getGroupedMappingName(name);
            if (this.mappingErrorMessage[groupedMappingName] && !this.mappingErrorMessage[groupedMappingName].date) {
                const errorMessage = rangeValidation(name, displayName, val, this.right);
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
        for (const [, value] of Object.entries(this.mappingErrorMessage)) {
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
        const isOriginRightIdRequired = name === 'originalRightId' && this.right.temporaryPriceReduction === true && this.right.status && this.right.status.value === 'Ready';
        if(map) {
            const canCreate =  !map.readOnly && can('create', 'Avail', map.javaVariableName);

            if (canCreate && (map.required || isOriginRightIdRequired)) {
                if (Array.isArray(value)) {
                    return value.length === 0 ? 'Field can not be empty' : '';
                }
                return this.validateNotEmpty(value);
            }
        }
        return '';
    }

    areMandatoryFieldsEmpty() {
        if(this.props.availsMapping.mappings.filter(({javaVariableName, readOnly}) => !readOnly && can('create', 'Avail', javaVariableName)).find(x => x.required && !this.right[x.javaVariableName])) return true;
        return false;
    }

    validateFields(){
        this.props.availsMapping.mappings.filter(({javaVariableName}) => can('create', 'Avail', javaVariableName)).map((mapping) => {
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
        if(this.props.match.params.availHistoryId){
            this.right.availHistoryIds=[this.props.match.params.availHistoryId];
        }
        rightsService.create(this.right).then((response) => {
            this.right={};
            this.setState({});
            if(response && response.id){
                if(this.props.match.params.availHistoryId){
                    this.context.router.history.push(URL.keepEmbedded('/avails/history/' + this.props.match.params.availHistoryId + '/manual-rights-entry'));
                }else{
                    this.context.router.history.push(RightsURL.getRightUrl(response.id));
                }

            }
            store.dispatch(blockUI(false));
        })
            .catch(() => {
                this.setState({errorMessage: 'Right creation Failed'});
                store.dispatch(blockUI(false));
            });
    }

    cancel(){
        if(this.props.match.params.availHistoryId){
            this.context.router.history.push(URL.keepEmbedded('/avails/history/' + this.props.match.params.availHistoryId + '/manual-rights-entry'));
        }else {
            this.context.router.history.push(URL.keepEmbedded('/avails'));
        }
    }

    initMappingErrors = (mappings) => {
        const mappingErrorMessage = {};
        mappings.filter(({dataType}) => dataType).map((mapping) => {
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

    toggleRightTerritoryForm = () => {
        this.setState({
            isRightTerritoryFormOpen: !this.state.isRightTerritoryFormOpen
        });
    }

    toggleRightAudioLanguageForm = () => {
        this.setState({
            isRightAudioLanguageFormOpen: !this.state.isRightAudioLanguageFormOpen
        });
    }

    render() {
        const renderFieldTemplate = (name, displayName, required, tooltip, content) => {
            return (
                <div
                    key={name}
                    className="list-group-item-action"
                    style={{border:'none', position:'relative', display:'block', padding:'0.75rem 1.25rem', marginBottom:'-1px', backgroundColor:'#fff'}}
                >
                    <div className="row">
                        <div className="col-4">{displayName}{required?<span className="text-danger">*</span>:''}:
                            {tooltip ? <span title={tooltip} style={{color: 'grey'}}>&nbsp;&nbsp;<i className="far fa-question-circle" /></span> : ''}
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
                    <Input defaultValue={value} type="text" name={name} id={'right-create-' + name + '-text'} placeholder={'Enter ' + displayName} onChange={this.handleChange} />
                    {this.mappingErrorMessage[name] && this.mappingErrorMessage[name].text && (
                    <small className="text-danger m-2">
                        {this.mappingErrorMessage[name] ? this.mappingErrorMessage[name].text ? this.mappingErrorMessage[name].text : '' : ''}
                    </small>
                  )}
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
                    {this.mappingErrorMessage[name] && this.mappingErrorMessage[name].text && (
                    <small className="text-danger m-2">
                        {this.mappingErrorMessage[name] ? this.mappingErrorMessage[name].text ? this.mappingErrorMessage[name].text : '' : ''}
                    </small>
                  )}
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
                    {this.mappingErrorMessage[name] && this.mappingErrorMessage[name].text && (
                    <small className="text-danger m-2">
                        {this.mappingErrorMessage[name] ? this.mappingErrorMessage[name].text ? this.mappingErrorMessage[name].text : '' : ''}
                    </small>
                  )}
                </div>
            ));
        };

        const renderDoubleField = (name, displayName, required, value) => {
            const validation = {number : true, pattern:{value: /^\d*(\d[.,]|[.,]\d)?\d*$/, errorMessage: 'Please enter a valid number'}};
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
                    {this.mappingErrorMessage[name] && this.mappingErrorMessage[name].text && (
                    <small className="text-danger m-2">
                        {this.mappingErrorMessage[name] ? this.mappingErrorMessage[name].text ? this.mappingErrorMessage[name].text : '' : ''}
                    </small>
                  )}
                </div>
            ));
        };

        const renderTimeField = (name, displayName, required, value) => {
            const validation = {pattern:{value: /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/, errorMessage: 'Please enter a valid time! (00:00:00 - 23:59:59)'}};
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
                    {this.mappingErrorMessage[name] && this.mappingErrorMessage[name].text && (
                    <small className="text-danger m-2">
                        {this.mappingErrorMessage[name] ? this.mappingErrorMessage[name].text ? this.mappingErrorMessage[name].text : '' : ''}
                    </small>
                  )}
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
            const filters = filterKeys.map((key) => this.right[key]).filter(x => (Array.isArray(x) ? x.length : x));

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

            const handleOptionsChange = (selectedOptions) => {
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
                    {this.mappingErrorMessage[name] && this.mappingErrorMessage[name].text && (
                    <small className="text-danger m-2">
                        {this.mappingErrorMessage[name] ? this.mappingErrorMessage[name].text ? this.mappingErrorMessage[name].text : '' : ''}
                    </small>
                  )}
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

            const handleOptionsChange = (option) => {
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
                    {this.mappingErrorMessage[name] && this.mappingErrorMessage[name].text && (
                    <small className="text-danger m-2">
                        {this.mappingErrorMessage[name] ? this.mappingErrorMessage[name].text ? this.mappingErrorMessage[name].text : '' : ''}
                    </small>
                  )}
                </div>
            ));
        };

        const renderBooleanField = (name, displayName, required, value) => {
            return renderFieldTemplate(name, displayName, required, null, (
                <select
                    className="form-control"
                    name={name}
                    id={'right-create-' + name + '-select'}
                    placeholder={'Enter ' + displayName}
                    value={value}
                    onChange={this.handleBooleanChange}
                >
                    <option value="">None selected</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </select>
            ));
        };

        const renderTerritoryField = (name, displayName, required, value) => {
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
            return renderFieldTemplate(name, displayName, required, null, (
                <TerritoryField
                    territory={this.right.territory}
                    name={name}
                    onRemoveClick={(terr) => this.handleDeleteObjectFromArray(terr.country, 'territory', 'country')}
                    onAddClick={this.toggleRightTerritoryForm}
                    renderChildren={() => (
                        <>
                            <div style={{position: 'absolute', right: '10px'}}>
                                <AddButton onClick={this.toggleRightTerritoryForm}>+</AddButton>
                            </div>
                            <RightTerritoryForm onSubmit={(e) => this.handleArrayPush(e, 'territory')} isOpen={this.state.isRightTerritoryFormOpen} onClose={this.toggleRightTerritoryForm} data={val} options={options} />
                        </>
)}
                    mappingErrorMessage={this.mappingErrorMessage}
                />
            ));
        };

        const renderAudioLanguageField = (name, displayName, required, value) => {
            let options = [], audioTypeOptions = [];
            let val;
            if(this.props.selectValues && this.props.selectValues['languageAudioTypes.language']){
                options  = this.props.selectValues['languageAudioTypes.language'];
            }
            if (this.props.selectValues && this.props.selectValues['languageAudioTypes.audioType']) {
                audioTypeOptions = this.props.selectValues['languageAudioTypes.audioType'];
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
            return renderFieldTemplate(name, displayName, required, null, (
                <AudioLanguageField
                    audioLanguages={this.right.languageAudioTypes}
                    name={name}
                    onRemoveClick={(audioL) => this.handleDeleteObjectFromArray(audioL.language, 'languageAudioTypes', 'language')}
                    onAddClick={this.toggleRightAudioLanguageForm}
                    renderChildren={() => (
                        <>
                            <div style={{position: 'absolute', right: '10px'}}>
                                <AddButton onClick={this.toggleRightAudioLanguageForm}>+</AddButton>
                            </div>
                            <RightAudioLanguageForm
                                onSubmit={(e) => this.handleArrayPush(e, 'languageAudioTypes')}
                                isOpen={this.state.isRightAudioLanguageFormOpen}
                                onClose={this.toggleRightAudioLanguageForm}
                                data={val}
                                languageOptions={options}
                                audioTypesOptions={audioTypeOptions}
                            />
                        </>
                    )}
                    mappingErrorMessage={this.mappingErrorMessage}
                />
            ));
        };

        const renderDatepickerField = (name, displayName, required, value, useTime, isTimestamp) => {
            const errors = this.mappingErrorMessage[name];
            const {date, text, range, pair} = errors || {};
            const error = date || text || range || pair || '';

            const props = {
                id: `right-create-${name}-text`,
                value,
                error,
                isTimestamp,
                onChange: (date) => {
                    this.handleDatepickerChange(name, displayName, date);
                    this.handleInvalidDatePicker(name, false);
                },
                allowClear: !required
            };

            const component = useTime
                ? <NexusDateTimePicker {...props} />
                : <NexusDatePicker {...props} />;

            return renderFieldTemplate(name, displayName, required, null, component);
        };

        const renderFields = [];

        if(this.props.availsMapping) {
            this.props.availsMapping.mappings.filter(({dataType}) => dataType).map((mapping)=> {
                if(mapping.enableEdit && !mapping.readOnly){
                    const required = mapping.required;
                    const value = this.right ? this.right[mapping.javaVariableName] : '';
                    const cannotCreate = cannot('create', 'Avail', mapping.javaVariableName);
                    if(cannotCreate){
                        return;
                    }
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
                        case 'duration' : renderFields.push(renderStringField(mapping.javaVariableName, mapping.displayName, required, value,
                            'format: PnYnMnDTnHnMnS. \neg. P3Y6M4DT12H30M5S (three years, six months, four days, twelve hours, thirty minutes, and five seconds)'));
                             break;
                        case 'time' : renderFields.push(renderTimeField(mapping.javaVariableName, mapping.displayName, required, value));
                            break;
                        case DATETIME_FIELDS.TIMESTAMP : renderFields.push(renderDatepickerField(mapping.javaVariableName, mapping.displayName, required, value, true, true));
                            break;
                        case DATETIME_FIELDS.REGIONAL_MIDNIGHT : renderFields.push(renderDatepickerField(mapping.javaVariableName, mapping.displayName, required, value, false, false));
                             break;
                        case DATETIME_FIELDS.BUSINESS_DATETIME : renderFields.push(renderDatepickerField(mapping.javaVariableName, mapping.displayName, required, value, true, false));
                            break;
                        case 'boolean' : renderFields.push(renderBooleanField(mapping.javaVariableName, mapping.displayName, required, value));
                             break;
                        case 'territoryType': renderFields.push(renderTerritoryField(mapping.javaVariableName, mapping.displayName, required, value));
                             break;
                        case 'audioLanguageType': renderFields.push(renderAudioLanguageField(mapping.javaVariableName, mapping.displayName, required, value));
                            break;
                        default:
                            console.warn('Unsupported DataType: ' + mapping.dataType + ' for field name: ' + mapping.displayName); // eslint-disable-line
                    }
                }
            });
        }

        return(
            <div style={{position: 'relative'}}>
                <BlockUi tag="div" blocking={this.props.blocking}>
                    <div
                        className={'d-inline-flex justify-content-center w-100 position-absolute' + (this.state && this.state.errorMessage ? ' alert-danger' : '')}
                        style={{top:'-20px', zIndex:'1000', height:'25px'}}
                    >
                        <Label id="right-create-error-message">
                            {this.state && this.state.errorMessage}
                        </Label>
                    </div>
                    <div className="nx-stylish row mt-3 mx-5">
                        <div className="nx-stylish list-group col" style={{overflowY:'scroll', height:'calc(100vh - 220px)'}}>
                            {renderFields}
                        </div>
                    </div>
                    {this.props.availsMapping && (
                        <div style={{display:'flex', justifyContent: 'flex-end'}}>
                            <div className="mt-4 mx-5">
                                <Button className="mr-2" id="right-create-submit-btn" color="primary" onClick={this.confirm}>Submit</Button>
                                <Button className="mr-4" id="right-create-cancel-btn" color="primary" onClick={this.cancel}>Cancel</Button>
                            </div>
                        </div>
                      )}
                </BlockUi>
                {/* Provide clashingRights for modal open*/}
                <RightsClashingModal />
            </div>
        );
    }
}

RightCreate.propTypes = {
    selectValues: PropTypes.object,
    availsMapping: PropTypes.any,
    blocking: PropTypes.bool,
    match: PropTypes.object
};

RightCreate.contextTypes = {
    router: PropTypes.object
};

export default connect(mapStateToProps, null)(RightCreate);

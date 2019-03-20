import React from 'react';
import connect from 'react-redux/es/connect/connect';
import t from 'prop-types';

import {saveCreateAvailForm} from '../../../stores/actions/avail/createavail';
import {Button, Input, Label} from 'reactstrap';
import NexusDatePicker from '../../../components/form/NexusDatePicker';
import {profileService} from '../service/ProfileService';
import {INVALID_DATE} from '../../../constants/messages';
import {rangeValidation} from '../../../util/Validation';
import {availService} from '../service/AvailService';
import store from '../../../stores/index';
import NexusBreadcrumb from '../../NexusBreadcrumb';
import {AVAILS_DASHBOARD, AVAILS_CREATE} from '../../../constants/breadcrumb';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import Select from 'react-select';
import { AvField, AvForm } from 'availity-reactstrap-validation';

const mapStateToProps = state => {
    return {
        availsMapping: state.root.availsMapping,
        selectValues: state.root.selectValues,
        storedForm: state.createavail.session.form,
    };
};

const mapDispatchToProps = {
    saveCreateAvailForm
};

const EXCLUDED_FIELDS = ['availId', 'rowEdited'];

class AvailCreate extends React.Component {

    static propTypes = {
        selectValues: t.object,
        saveCreateAvailForm: t.func,
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
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

        this.mappingErrorMessage = {};
        this.avail = {},

        this.state = {
            columns: 1
        };
    }

    componentDidMount() {
        if(NexusBreadcrumb.empty()) NexusBreadcrumb.set(AVAILS_DASHBOARD);

        NexusBreadcrumb.push(AVAILS_CREATE);
        this.avail = this.props.storedForm;

        if(this.props.availsMapping){
            this.initMappingErrors(this.props.availsMapping.mappings);
        }else{
            profileService.initAvailsMapping();
        }

        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        NexusBreadcrumb.pop();
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        const columns = window.innerWidth > 1240 ? 3 : (window.innerWidth > 830 ? 2 : 1);
        if(this.state.columns !== columns) //performance optimization, state changed (triggers render) only when columns number changes
            this.setState({ columns: columns });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.availsMapping !== this.props.availsMapping) {
            this.initMappingErrors(this.props.availsMapping.mappings);
        }
        if(prevProps.storedForm !== this.props.storedForm){
            this.avail = this.props.storedForm;
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
        this.checkAvail(name, value, true, false);
    }

    handleChangeSave({target}) {
        const value = target.type === 'checkbox' ? target.checked : (target.value ? target.value.trim() : '');
        const name = target.name;
        this.checkAvail(name, value, true, true);
    }

    checkAvail(name, value, setNewValue, save) {
        const validationError = this.validateField(name, value);

        let errorMessage = {range: '', date: '', text: validationError};
        this.mappingErrorMessage[name] = errorMessage;

        if(setNewValue){

            let newAvail = {...this.avail, [name]: value};

            this.avail = newAvail;
            if(save) {
                store.dispatch(saveCreateAvailForm(newAvail));
            }
        }
    }

    handleDatepickerChange(name, displayName, date) {
        this.avail[name] = date;
        const groupedMappingName = this.getGroupedMappingName(name);

        if (this.mappingErrorMessage[groupedMappingName] && !this.mappingErrorMessage[groupedMappingName].date) {
            const errorMessage = rangeValidation(name, displayName, date, this.avail);
            this.mappingErrorMessage[name].range = errorMessage;
            if (this.mappingErrorMessage[groupedMappingName]) {
                this.mappingErrorMessage[groupedMappingName].range = errorMessage;
            }
        }

        store.dispatch(saveCreateAvailForm(this.avail));
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
        if (!data || !data.trim()) {
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
        if(this.props.availsMapping.mappings.find(x => x.required && !this.avail[x.javaVariableName])) return true;
        return false;
    }

    validateFields(){
        this.props.availsMapping.mappings.map((mapping) => {
            if(mapping.dataType === 'date') return;
            this.checkAvail(mapping.javaVariableName, this.avail[mapping.javaVariableName], false);
        });
        this.setState({});
        return this.anyInvalidField();
    }

    confirm() {
        if(this.validateFields()) return;
        availService.createAvail(this.avail).then((response) => {
            this.avail={};
            this.setState({});
            saveCreateAvailForm({});
            if(response && response.data && response.data.id){
                this.context.router.history.push('/avails/' + response.data.id);
            }
        })
            .catch(() => this.setState({errorMessage: 'Avail creation Failed'}));
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
                        <div className="col">
                            {content}
                        </div>
                    </div>
                </div>
            );
        };

        const renderStringField = (name, displayName, required, value) => {
            return renderFieldTemplate(name, displayName, required, (
                <div>
                    <Input defaultValue={value} type="text" name={name} id={'avails-create-' + name + '-text'} placeholder={'Enter ' + displayName} onChange={this.handleChange} onBlur={this.handleChangeSave}/>
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
                                id={'avails-create-' + name + '-text'}
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
                            id={'avails-create-' + name + '-text'}
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
                            id={'avails-create-' + name + '-text'}
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
            const filterKeys = Object.keys(this.avail).filter((key) => this.props.availsMapping.mappings.find((x)=>x.javaVariableName === key).configEndpoint);
            let filters = filterKeys.map((key) => this.avail[key]).filter(x => (Array.isArray(x) ? x.length : x));

            let filteredOptions = options;
            filters.map(filter => {
                const fieldName = filter[0].type + 'Id';
                const allowedOptions = filter.map(({id}) => id);
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
                this.checkAvail(name, selectedOptions, true, true);
            };

            return renderFieldTemplate(name, displayName, required, (
                <div
                    id={'avails-create-' + name + '-multiselect'}
                    key={name}
                    className="react-select-container"
                >
                    <ReactMultiSelectCheckboxes
                        placeholderButtonLabel={'Select ' + displayName + ' ...'}
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
                val = value[0];
                options.unshift({value: '', label: value ? 'Select...' : ''});
            }

            let handleOptionsChange = (option) => {
                this.checkAvail(name, option.value ? [option] : null, true, true);
            };

            return renderFieldTemplate(name, displayName, required, (
                <div
                    id={'avails-create-' + name + '-select'}
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
                        id={'avails-create-' + name + '-select'}
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
                        id={'avails-create-' + name + '-text'}
                        date={this.avail[name]}
                        onChange={(date) => this.handleDatepickerChange(name, displayName, date)}
                        onInvalid={(invalid) => this.handleInvalidDatePicker(name, invalid)}
                    />
                    {this.mappingErrorMessage[name] && this.mappingErrorMessage[name].date &&
                    <small className="text-danger m-2">
                        {this.mappingErrorMessage[name].date}
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

        const renderColumns = [];

        if(this.props.availsMapping) {
            const renderFields = [];

            this.props.availsMapping.mappings.map((mapping)=> {
                if(EXCLUDED_FIELDS.indexOf(mapping.javaVariableName) === -1){
                    let required = mapping.required;
                    const value = this.avail ? this.avail[mapping.javaVariableName] : '';
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

            const perColumn = Math.ceil(renderFields.length / this.state.columns);

            for (let i = 0; i < this.state.columns; i++) {
                renderColumns.push(
                    <div key={i} className="nx-stylish list-group col">
                        {renderFields.slice(i*perColumn, (i+1)*perColumn)}
                    </div>
                );
            }
        }
        return(
            <div>
                <div className="nx-stylish row mt-3 mx-5">
                    {renderColumns}
                </div>
                <Label id="avails-create-error-message" className="text-danger w-100 mt-2 ml-5 pl-3">
                    {this.state.errorMessage}
                </Label>
                {this.props.availsMapping &&
                    <div className="float-right mt-3 mx-5">
                        <Button className="mr-2" id="avails-create-submit-btn" color="primary" onClick={this.confirm}>Submit</Button>
                        <Button className="mr-4" id="avails-create-cancel-btn" color="primary" onClick={this.cancel}>Cancel</Button>
                    </div>
                }
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AvailCreate);
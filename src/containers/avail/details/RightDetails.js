import React from 'react';
import ReactDOM from 'react-dom';
import connect from 'react-redux/es/connect/connect';
import t from 'prop-types';
import Editable from 'react-x-editable';
import config from 'react-global-configuration';
import {Button, Label} from 'reactstrap';

import store from '../../../stores/index';
import {blockUI} from '../../../stores/actions/index';
import {rightsService} from '../service/RightsService';
import EditableDatePicker from '../../../components/form/EditableDatePicker';
import EditableBaseComponent from '../../../components/form/editable/EditableBaseComponent';
import {oneOfValidation, rangeValidation} from '../../../util/Validation';
import {profileService} from '../service/ProfileService';
import {cannot} from '../../../ability';
import './RightDetails.scss';
import NexusBreadcrumb from '../../NexusBreadcrumb';
import {AVAILS_DASHBOARD} from '../../../constants/breadcrumb';
import Select from 'react-select';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import {AvField, AvForm} from 'availity-reactstrap-validation';
import {getDeepValue, safeTrim} from '../../../util/Common';
import moment from 'moment';
import {momentToISO} from '../../../util/Common';
import BlockUi from 'react-block-ui';
import RightsURL from '../util/RightsURL';
import {confirmModal} from '../../../components/modal/ConfirmModal';

const mapStateToProps = state => {
   return {
       availsMapping: state.root.availsMapping,
       selectValues: state.root.selectValues,
       blocking: state.root.blocking,
   };
};

class RightDetails extends React.Component {

    static propTypes = {
        selectValues: t.object,
        availsMapping: t.any,
        match: t.any,
        location: t.any,
        blocking: t.bool
    };

    static contextTypes = {
        router: t.object
    }

    refresh = null;

    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.cancel = this.cancel.bind(this);
        this.getRightData = this.getRightData.bind(this);

        this.emptyValueText = 'Enter';
        this.fields = {};

        this.state = {
            errorMessage: ''
        };
    }

    componentDidMount() {
        if(NexusBreadcrumb.empty()) NexusBreadcrumb.set(AVAILS_DASHBOARD);
        NexusBreadcrumb.push({name: '', path: '/avails/'});
        profileService.initAvailsMapping();
        this.getRightData();
        if(this.refresh === null){
            this.refresh = setInterval(this.getRightData, config.get('avails.edit.refresh.interval'));
        }
    }

    componentWillUnmount() {
        if(this.refresh !== null){
            clearInterval(this.refresh);
            this.refresh = null;
        }
        NexusBreadcrumb.pop();
    }

    getRightData() {
        if(this.props.match && this.props.match.params && this.props.match.params.id){
            rightsService.get(this.props.match.params.id)
                .then(res => {
                    if(res && res.data){
                        this.setState({
                            right: res.data,
                            flatRight: this.flattenRight(res.data)
                        });
                        NexusBreadcrumb.pop();
                        NexusBreadcrumb.push({name: res.data.title, path: '/avails/' + res.data.id});
                    }
                })
                .catch(() => {
                    this.setState({
                        errorMessage: 'Sorry, we could not find a right with id ' + this.props.match.params.id + ' !'
                    });
                });
        }
    }

    handleSubmit(editable) {
        const name = editable.props.title;
        const value = safeTrim(editable.value);

        this.update(name, value, () => {
            editable.setState({rightLastEditSucceed: false});
            editable.value = this.state.right[name];
            editable.newValue = this.state.right[name];
        });
    }

    handleEditableSubmit(name, value, cancel) {
        const schema = this.props.availsMapping.mappings.find(({javaVariableName}) => javaVariableName === name);
        switch (schema.dataType) {
            case 'date': value = value && moment(value).isValid() ? moment(value).format('YYYY-MM-DD') + 'T00:00:00.000Z' : value;
                break;
            case 'localdate': value = value && moment(value).isValid() ? momentToISO(value) : value;
                break;
        }
        this.update(name, value, () => {
            cancel();
        });
    }

    flattenRight(right){
        let rightCopy = {};

        this.props.availsMapping.mappings.forEach(map => {
            const val = getDeepValue(right, map.javaVariableName);
            if(val || val === false || val === null) {
                if(Array.isArray(val) && map.dataType === 'string') {
                    rightCopy[map.javaVariableName] = val.join(',');
                }else {
                    rightCopy[map.javaVariableName] = val;
                }
            }

        });
        return rightCopy;
    }

    update(name, value, onError) {
        if(this.state.flatRight[name] === value){
            onError();
            return;
        }
        let updatedRight = {[name]: value};
        if(name.indexOf('.') > 0 && name.split('.')[0] === 'languages'){
            if(name.split('.')[1] === 'language'){
                updatedRight['languages.audioType'] = this.state.flatRight['languages.audioType'];
            }else{
                updatedRight['languages.language'] = this.state.flatRight['languages.language'];
            }
        }
        store.dispatch(blockUI(true));
        rightsService.update(updatedRight, this.state.right.id)
            .then(res => {
                let editedRight = res.data;
                this.setState({
                    right: res.data,
                    flatRight: this.flattenRight(res.data),
                    errorMessage: ''
                });
                NexusBreadcrumb.pop();
                NexusBreadcrumb.push({name: editedRight.title, path: '/avails/' + editedRight.id});
                store.dispatch(blockUI(false));
            })
            .catch(() => {
                this.setState({
                    errorMessage: 'Editing right failed'
                });
                store.dispatch(blockUI(false));
                onError();
            });
    }

    validateNotEmpty(data) {
        return data.trim() ? '' : <small>Field can not be empty</small>;
    }

    validateTextField(target, field) {
        const value =  target.newValue ? target.newValue.trim() : '';

        for(let i=0; i < this.props.availsMapping.mappings.length; i++){
            let mapping = this.props.availsMapping.mappings[i];
            if(mapping.javaVariableName === field) {
                if(mapping.required) return this.validateNotEmpty(value);
            }
        }
        return '';
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

    extraValidation(name, displayName, date, right){
        const pairFieldName = this.getPairFieldName(name);
        if(pairFieldName) {
            const mappingPair = this.props.availsMapping.mappings.find(({javaVariableName}) => javaVariableName === pairFieldName);
            return oneOfValidation(name, displayName, date, pairFieldName, mappingPair.displayName, right);
        }
    }

    cancel(){
        this.context.router.history.push(RightsURL.getSearchURLFromRightUrl(window.location.pathname, window.location.search));
    }

    onFieldClicked(e){
        const node = ReactDOM.findDOMNode(e.currentTarget);
        if(e.target.tagName === 'A' || e.target.tagName === 'SPAN'){
            node.classList.add('no-border');
        }
        if(e.target.tagName === 'I' || e.target.tagName === 'BUTTON'){
            node.classList.remove('no-border');
        }
    }

    onEditableClick(ref){
        if(ref && ref.current){
            const component = ref.current;
            if(component instanceof Editable || component instanceof EditableBaseComponent){
                if(component.state && !component.state.editable) {
                    confirmModal.open('Confirm edit',
                        () => {
                        },
                        () => {
                            component.setEditable(false);
                        },
                        {description: 'Are you sure you want to edit this field?'});
                }
            }
        }
    }

    render() {
        const renderFieldTemplate = (name, displayName, value, error, readOnly, required, highlighted, tooltip, ref, content) => {
            const hasValidationError = error;
            return (
                <div key={name}
                    className={(readOnly ? ' disabled' : '') + (highlighted ? ' font-weight-bold' : '')}
                    style={{backgroundColor: hasValidationError ? '#f2dede' : '#fff',
                            color: hasValidationError ? '#a94442' : null,
                            border:'none',
                            position:'relative', display:'block', padding:'0.75rem 1.25rem', marginBottom:'-1px',
                        }}>
                    <div className="row">
                        <div className="col-4">{displayName}
                            {required ? <span className="text-danger">*</span>:''}
                            :
                            {highlighted ? <span title={'* fields in bold are original values provided by the studios'} style={{color: 'grey'}}>&nbsp;&nbsp;<i className="far fa-question-circle"></i></span> : ''}
                            {tooltip ? <span title={tooltip} style={{color: 'grey'}}>&nbsp;&nbsp;<i className="far fa-question-circle"></i></span> : ''}
                        </div>
                        <div
                            onClick = {this.onFieldClicked}
                            className={'editable-field col-8' + (value ? '' : ' empty') + (readOnly ? ' disabled' : '')}
                            id={'right-detail-' + name + '-field'}>
                            <div className="editable-field-content"
                                 onClick={highlighted ? () => this.onEditableClick(ref) : null}
                            >
                                {content}
                            </div>
                            <span className="edit-icon" style={{color: 'gray'}}><i className="fas fa-pen"></i></span>
                        </div>
                    </div>
                </div>
            );
        };
        const renderTextField = (name, displayName, value, error, readOnly, required, highlighted) => {
            const ref = React.createRef();
            const displayFunc = (val) => {
                if(error){
                    return (<div title = {error}
                        style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace:'nowrap',
                                color: error ? '#a94442' : null
                            }}
                        > {error} </div>);
                }else{
                    return val;
                }
            };

            return renderFieldTemplate(name, displayName, value, error, readOnly, required, highlighted, null, ref, (
                <Editable
                    ref={ref}
                    title={name}
                    value={value}
                    disabled={readOnly}
                    dataType="text"
                    mode="inline"
                    placeholder={this.emptyValueText + ' ' + displayName}
                    handleSubmit={this.handleSubmit}
                    emptyValueText={displayFunc(readOnly ? '' : this.emptyValueText + ' ' + displayName)}
                    validate={() => this.validateTextField(ref.current, name)}
                    display={displayFunc}
                />
            ));
        };

        const renderAvField = (name, displayName, value, error, readOnly, required, highlighted, tooltip, validation) => {
            const ref = React.createRef();
            let priorityError = null;
            if(error){
                priorityError = <div title = {error}
                                     style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace:'nowrap', color: '#a94442'}}>
                    {error}
                </div>;
            }

            let handleValueChange = (newVal) => {
                const error = validate(newVal);
                if(error){
                    ref.current.handleInvalid(newVal, error);
                }else{
                    ref.current.handleChange(newVal);
                }
                setTimeout(() => {
                    this.setState({});
                }, 1);
            };

            const validate = (val) => {
                if(validation && validation.number) {
                    const isNumber = !isNaN(val);
                    if(!isNumber) return 'Please enter a valid number!';
                }
                if(validation && validation.pattern){
                    const isValid = val ? validation.pattern.value.test(val) : !required;
                    if(!isValid) return validation.pattern.errorMessage;
                }
            };

            const innerValidate = (val, ctx, input, cb) => {
                if(validation && validation.number) {
                    const isNumber = !isNaN(val);
                    cb(isNumber);
                }
                if(validation && validation.pattern){
                    cb(val ? validation.pattern.value.test(val) : !required);
                }

                if(!validation){
                    cb(true);
                }
            };

            const convert = (val) => {
                if(val && validation && validation.number) {
                    return Number(val);
                }
                return val ? val : null;
            };

            let errorMessage='';
            if(validation){
                if(validation.number){
                    errorMessage = 'Please enter a valid number!';
                }
                if(validation.pattern && validation.pattern.errorMessage){
                    errorMessage = validation.pattern.errorMessage;
                }
            }

            return renderFieldTemplate(name, displayName, value, error, readOnly, required, highlighted, tooltip, ref, (
                <EditableBaseComponent
                    ref={ref}
                    value={value}
                    priorityDisplay={priorityError}
                    name={name}
                    disabled={readOnly}
                    displayName={displayName}
                    validate={validate}
                    onChange={(value, cancel) => this.handleEditableSubmit(name, convert(value), cancel)}
                    showError={false}
                    helperComponent={<AvForm>
                        <AvField
                            value={value}
                            name={name}
                            placeholder={'Enter ' + displayName}
                            onChange={(e) => {handleValueChange(e.target.value);}}
                            type="text"
                            validate={{...validation, async: innerValidate}}
                            errorMessage={errorMessage}
                        />
                    </AvForm>}
                />
            ));
        };

        const renderIntegerField = (name, displayName, value, error, readOnly, required, highlighted) => {
            return renderAvField(name, displayName, value, error, readOnly, required, highlighted, null, {number : true});
        };

        const renderDoubleField = (name, displayName, value, error, readOnly, required, highlighted) => {
            return renderAvField(name, displayName, value, error, readOnly, required, highlighted, null, {number : true});
        };

        const renderTimeField = (name, displayName, value, error, readOnly, required, highlighted) => {
            return renderAvField(name, displayName, value, error, readOnly, required, highlighted, null, {pattern: {value: /^([01]?\d|2[0-3]):[0-5]\d:[0-5]\d$/, errorMessage: 'Please enter a valid time! (00:00:00 - 23:59:59)'}});
        };

        const renderDurationField = (name, displayName, value, error, readOnly, required, highlighted) => {
            return renderAvField(name, displayName, value, error, readOnly, required, highlighted,
                'format: PnYnMnDTnHnMnS. \neg. P3Y6M4DT12H30M5S (three years, six months, four days, twelve hours, thirty minutes, and five seconds)'
            );
        };

        const renderBooleanField = (name, displayName, value, error, readOnly, required, highlighted) => {
            let priorityError = null;
            if(error){
                priorityError = <div title = {error}
                                     style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace:'nowrap', color: '#a94442'}}>
                    {error}
                </div>;
            }

            let ref;
            if(this.fields[name]){
                ref = this.fields[name];

            }else{
                this.fields[name] = ref = React.createRef();
            }

            let options = [ {server: null, value: 1, label: 'Select...', display: null},
                            {server: false, value: 2, label: 'No', display: 'No'},
                            {server: true, value: 3, label: 'Yes', display: 'Yes'}];
            const val = ref.current ? options.find((opt) => opt.display === ref.current.state.value) : options.find((opt) => opt.server === value);

            let handleOptionsChange = (option) => {
                ref.current.handleChange(option.display);
                setTimeout(() => {
                    this.setState({});
                }, 1);
            };

            return renderFieldTemplate(name, displayName, val.display, error, readOnly, required, highlighted, null, ref, (
                <EditableBaseComponent
                    ref={ref}
                    value={options.find((opt) => opt.server === value).display}
                    priorityDisplay={priorityError}
                    name={name}
                    disabled={readOnly}
                    displayName={displayName}
                    validate={() => {}}
                    onChange={(value, cancel) => this.handleEditableSubmit(name, options.find(({display}) => display == value).server, cancel) }
                    helperComponent={<Select
                        name={name}
                        placeholderButtonLabel={'Select ' + displayName + ' ...'}
                        options={options}
                        value={val}
                        onChange={handleOptionsChange}
                    />}
                />
            ));
        };

        const renderSelectField = (name, displayName, value, error, readOnly, required, highlighted) => {
            let priorityError = null;
            if(error){
                priorityError = <div title = {error}
                                     style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace:'nowrap', color: '#a94442'}}>
                    {error}
                </div>;
            }

            let ref;
            if(this.fields[name]){
                ref = this.fields[name];

            }else{
                this.fields[name] = ref = React.createRef();
            }

            let options = [];
            let selectedVal = ref.current? ref.current.state.value : value;
            let val;
            if(this.props.selectValues && this.props.selectValues[name]){
                options  = this.props.selectValues[name];
            }

            options = options.filter((rec) => (rec.value)).map(rec => { return {...rec,
                label: rec.label || rec.value,
                aliasValue:(rec.aliasId ? (options.filter((pair) => (rec.aliasId === pair.id)).length === 1 ? options.filter((pair) => (rec.aliasId === pair.id))[0].value : null) : null)};});

            if(options.length > 0 && selectedVal){
                val = options.find((opt) => opt.value === selectedVal);
                options.unshift({value: '', label: value ? 'Select...' : ''});
            }

            let handleOptionsChange = (option) => {
                ref.current.handleChange(option.value ? option.value : null);
                setTimeout(() => {
                    this.setState({});
                }, 1);
            };

            return renderFieldTemplate(name, displayName, value, error, readOnly, required, highlighted, null, ref, (
                <EditableBaseComponent
                    ref={ref}
                    value={value}
                    priorityDisplay={priorityError}
                    name={name}
                    disabled={readOnly}
                    displayName={displayName}
                    validate={() => {}}
                    onChange={(value, cancel) => this.handleEditableSubmit(name, value, cancel)}
                    helperComponent={<Select
                        name={name}
                        isSearchable
                        placeholderButtonLabel={'Select ' + displayName + ' ...'}
                        options={options}
                        value={val}
                        onChange={handleOptionsChange}
                    />}
                />
            ));
        };

        const renderMultiSelectField = (name, displayName, value, error, readOnly, required, highlighted) => {
            let priorityError = null;
            if(error){
                priorityError = <div title = {error}
                                     style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace:'nowrap', color: '#a94442'}}>
                    {error}
                </div>;
            }

            let ref;
            if(this.fields[name]){
                ref = this.fields[name];

            }else{
                this.fields[name] = ref = React.createRef();
            }

            let options = [];
            let selectedVal = ref.current? ref.current.state.value : value;
            let val;
            if(this.props.selectValues && this.props.selectValues[name]){
                options  = this.props.selectValues[name];
            }

            //fields with enpoints (these have ids)
            const filterKeys = Object.keys(this.state.flatRight).filter((key) => this.props.availsMapping.mappings.find((x)=>x.javaVariableName === key).configEndpoint);
            let filters = filterKeys.map((key) => {
                if(this.state.flatRight[key] && this.props.selectValues[key]) {
                    const filt = (Array.isArray(this.state.flatRight[key]) ? this.state.flatRight[key] : [this.state.flatRight[key]]).map(val => {
                        const candidates = this.props.selectValues[key].filter(opt => opt.value === val);
                        return candidates.length ? candidates : null;
                    }).filter(x => x).flat();
                    return filt.length ? filt : null;
                }
            }).filter(x => x);//.filter(x => (Array.isArray(x) ? x.length : x));

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

            if(allOptions[0].options && allOptions[0].options.length > 0 && selectedVal && Array.isArray(selectedVal)){
                val = selectedVal.map(v => allOptions[0].options.filter(opt => opt.value === v)).flat();
            }

            let handleOptionsChange = (selectedOptions) => {
                const selVal = selectedOptions.map(({value}) => value);
                ref.current.handleChange(selVal ? selVal : null);
                setTimeout(() => {
                    this.setState({});
                }, 1);
            };

            return renderFieldTemplate(name, displayName, value, error, readOnly, required, highlighted, null, ref, (
                <EditableBaseComponent
                    ref={ref}
                    value={value}
                    priorityDisplay={priorityError}
                    name={name}
                    disabled={readOnly}
                    displayName={displayName}
                    validate={() => {}}
                    onChange={(value, cancel) => this.handleEditableSubmit(name, value, cancel)}
                    helperComponent={<ReactMultiSelectCheckboxes
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
                        value={val}
                        onChange={handleOptionsChange}
                    />}
                />
            ));
        };

        const renderDatepickerField = (name, displayName, value, error, readOnly, required, highlighted) => {
            let ref;
            let priorityError = null;
            if(error){
                priorityError = <div title = {error}
                                    style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace:'nowrap', color: '#a94442'}}>
                                    {error}
                                </div>;
            }
            return renderFieldTemplate(name, displayName, value, error, readOnly, required, highlighted, null, ref, (
                <EditableDatePicker
                    ref={ref}
                    showTime={readOnly}
                    value={value}
                    priorityDisplay={priorityError}
                    name={name}
                    disabled={readOnly}
                    displayName={displayName}
                    validate={(date) => {
                        const rangeError = rangeValidation(name, displayName, date, this.state.flatRight);
                        if(rangeError) return rangeError;
                        return this.extraValidation(name, displayName, date, this.state.flatRight);
                    }}
                    onChange={(date, cancel) => this.handleEditableSubmit(name, date, cancel)}
                />
            ));
        };

        const renderFields = [];

        if(this.state.flatRight && this.props.availsMapping) {

            const cannotUpdate = cannot('update', 'Avail');

            this.props.availsMapping.mappings.map((mapping)=> {
                if (mapping.enableEdit) {
                    let error = null;
                    if (this.state.right && this.state.right.validationErrors) {
                        this.state.right.validationErrors.forEach(e => {
                            if (e.fieldName === mapping.javaVariableName) {
                                error = e.message;
                                if (e.sourceDetails) {
                                    if (e.sourceDetails.originalValue) error += ', original value:  \'' + e.sourceDetails.originalValue + '\'';
                                    if (e.sourceDetails.fileName) {
                                        error += ', in file ' + e.sourceDetails.fileName
                                            + ', row number ' + e.sourceDetails.rowId
                                            + ', column ' + e.sourceDetails.originalFieldName;
                                    }
                                }
                            }
                        });
                    }

                    const readOnly = cannotUpdate || mapping.readOnly;
                    const value = this.state.flatRight ? this.state.flatRight[mapping.javaVariableName] : '';
                    const required = mapping.required;
                    let highlighted = false;
                    if(this.state.right && this.state.right.highlightedFields) {
                        highlighted = this.state.right.highlightedFields.indexOf(mapping.javaVariableName) > -1;
                    }
                    switch (mapping.dataType) {
                        case 'string': renderFields.push(renderTextField(mapping.javaVariableName, mapping.displayName, value, error, readOnly, required, highlighted));
                            break;
                        case 'integer': renderFields.push(renderIntegerField(mapping.javaVariableName, mapping.displayName, value, error, readOnly, required, highlighted));
                            break;
                        case 'double': renderFields.push(renderDoubleField(mapping.javaVariableName, mapping.displayName, value, error, readOnly, required, highlighted));
                            break;
                        case 'select': renderFields.push(renderSelectField(mapping.javaVariableName, mapping.displayName, value, error, readOnly, required, highlighted));
                            break;
                        case 'multiselect': renderFields.push(renderMultiSelectField(mapping.javaVariableName, mapping.displayName, value, error, readOnly, required, highlighted));
                            break;
                        case 'language': renderFields.push(renderSelectField(mapping.javaVariableName, mapping.displayName, value, error, readOnly, required, highlighted));
                            break;
                        case 'multilanguage': renderFields.push(renderMultiSelectField(mapping.javaVariableName, mapping.displayName, value, error, readOnly, required, highlighted));
                            break;
                        case 'duration': renderFields.push(renderDurationField(mapping.javaVariableName, mapping.displayName, value, error, readOnly, required, highlighted));
                            break;
                        case 'time': renderFields.push(renderTimeField(mapping.javaVariableName, mapping.displayName, value, error, readOnly, required, highlighted));
                             break;
                        case 'date': renderFields.push(renderDatepickerField(mapping.javaVariableName, mapping.displayName, value ? value.substr(0, 10) : value, error, readOnly, required, highlighted));
                             break;
                        case 'localdate': renderFields.push(renderDatepickerField(mapping.javaVariableName, mapping.displayName, value, error, readOnly, required, highlighted));
                            break;
                        case 'boolean': renderFields.push(renderBooleanField(mapping.javaVariableName, mapping.displayName, value, error, readOnly, required, highlighted));
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
                    {
                        this.state.errorMessage &&
                        <div id='right-edit-error' className='d-inline-flex justify-content-center w-100 position-absolute alert-danger' style={{top:'-20px', zIndex:'1000', height:'25px'}}>
                            <Label id='right-edit-error-message'>
                                {this.state.errorMessage}
                            </Label>
                        </div>
                    }
                    <div className="nx-stylish row mt-3 mx-5">
                        <div className={'nx-stylish list-group col-12'} style={{overflowY:'scroll', height:'calc(100vh - 220px)'}}>
                            {renderFields}
                        </div>
                    </div>
                    {this.props.availsMapping &&
                        <div style={{display:'flex', justifyContent: 'flex-end'}} >
                            <div className="mt-4 mx-5 px-5">
                                <Button className="mr-5" id="right-edit-cancel-btn" color="primary" onClick={this.cancel}>Cancel</Button>
                            </div>
                        </div>
                    }
                </BlockUi>
            </div>
        );
    }
}

export default connect(mapStateToProps, null)(RightDetails);
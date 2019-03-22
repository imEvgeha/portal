import React from 'react';
import ReactDOM from 'react-dom';
import connect from 'react-redux/es/connect/connect';
import t from 'prop-types';
import Editable from 'react-x-editable';
import config from 'react-global-configuration';
import {Button, Label} from 'reactstrap';

import {availService} from '../service/AvailService';
import EditableDatePicker from '../../../components/form/EditableDatePicker';
import EditableBaseComponent from '../../../components/form/editable/EditableBaseComponent';
import {rangeValidation} from '../../../util/Validation';
import {profileService} from '../service/ProfileService';
import {cannot} from '../../../ability';
import './AvailDetails.scss';
import NexusBreadcrumb from '../../NexusBreadcrumb';
import {AVAILS_DASHBOARD} from '../../../constants/breadcrumb';
import Select from 'react-select';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';

const mapStateToProps = state => {
   return {
       availsMapping: state.root.availsMapping,
       selectValues: state.root.selectValues,
   };
};

const EXCLUDED_FIELDS = ['availId'];
const READONLY_FIELDS = ['rowEdited'];

class AvailDetails extends React.Component {

    static propTypes = {
        selectValues: t.object,
        availsMapping: t.any,
        match: t.any,
        location: t.any
    };

    static contextTypes = {
        router: t.object
    }

    refresh = null;

    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.cancel = this.cancel.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.getAvailData = this.getAvailData.bind(this);

        this.emptyValueText = 'Enter';
        this.fields = {};

        this.state = {
            errorMessage: '',
            columns: 1
        };
    }

    componentDidMount() {
        if(NexusBreadcrumb.empty()) NexusBreadcrumb.set(AVAILS_DASHBOARD);
        NexusBreadcrumb.push({name: '', path: '/avails/'});
        profileService.initAvailsMapping();
        this.getAvailData();
        if(this.refresh === null){
            this.refresh = setInterval(this.getAvailData, config.get('avails.edit.refresh.interval'));
        }
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        if(this.refresh !== null){
            clearInterval(this.refresh);
            this.refresh = null;
        }
        NexusBreadcrumb.pop();
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        // const columns = window.innerWidth > 1240 ? 3 : (window.innerWidth > 830 ? 2 : 1);
        // if(this.state.columns !== columns) //performance optimization, state changed (triggers render) only when columns number changes
        //     this.setState({ columns: columns });
    }

    getAvailData() {
        if(this.props.match && this.props.match.params && this.props.match.params.id){
            availService.getAvail(this.props.match.params.id)
                .then(res => {
                    if(res && res.data){
                        this.setState({
                            avail: res.data,
                            flatAvail: this.flattenAvail(res.data)
                        });
                        NexusBreadcrumb.pop();
                        NexusBreadcrumb.push({name: res.data.title, path: '/avails/' + res.data.id});
                    }
                })
                .catch(() => {
                    this.setState({
                        errorMessage: 'Cannot retrieve avail'
                    });
                });
        }
    }

    handleSubmit(editable) {
        const name = editable.props.title;
        const value = editable.value ? editable.value.trim() : editable.value;
        this.update(name, value, () => {
            editable.setState({availLastEditSucceed: false});
            editable.value = this.state.avail[name];
            editable.newValue = this.state.avail[name];
        });
    }

    handleEditableSubmit(name, value, cancel) {
        this.update(name, value, () => {
            cancel();
        });
    }

    getDeepValue(source, location){
        const dotPos = location.indexOf('.');
        if(dotPos > 0) {
            const firstKey = location.split('.')[0];
            const restKey = location.substring(dotPos+1);
            return source[firstKey] ? this.getDeepValue(source[firstKey], restKey) : null;
        }else{
            return source[location];
        }
    }

    flattenAvail(avail){
        let availCopy = {};

        this.props.availsMapping.mappings.forEach(map => {
            const val = this.getDeepValue(avail, map.javaVariableName);
            if(val) availCopy[map.javaVariableName] = val;
        });

        return availCopy;
    }

    update(name, value, onError) {
        let updatedAvail = {[name]: value};
        availService.updateAvails(updatedAvail, this.state.avail.id)
            .then(res => {
                let editedAvail = res.data;
                this.setState({
                    avail: this.flattenAvail(editedAvail),
                    errorMessage: ''
                });
                NexusBreadcrumb.pop();
                NexusBreadcrumb.push({name: editedAvail.title, path: '/avails/' + editedAvail.id});
            })
            .catch(() => {
                this.setState({
                    errorMessage: 'Avail edit failed'
                });
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

    cancel(){
        this.context.router.history.push('/avails');
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

    render() {
        const renderFieldTemplate = (name, displayName, value, error, readOnly, required, content) => {
            const hasValidationError = error;
            return (
                <div key={name}
                    className={'list-group-item' + (readOnly ? ' disabled' : '')}
                    style={{backgroundColor: hasValidationError ? '#f2dede' : null,
                            color: hasValidationError ? '#a94442' : null,
                            border:'none'
                        }}>
                    <div className="row">
                        <div className="col-4">{displayName}{required?<span className="text-danger">*</span>:''}:</div>
                        <div
                            onClick = {this.onFieldClicked}
                            className={'editable-field col-8' + (value ? '' : ' empty') + (readOnly ? ' disabled' : '')}
                            id={'avails-detail-' + name + '-field'}>
                            <div className="editable-field-content">
                                {content}
                            </div>
                            <span className="edit-icon" style={{color: 'gray'}}><i className="fas fa-pen"></i></span>
                        </div>
                    </div>
                </div>
            );
        };
        const renderTextField = (name, displayName, value, error, readOnly, required) => {
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

            return renderFieldTemplate(name, displayName, value, error, readOnly, required, (
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

        const renderBooleanField = (name, displayName, value, error, readOnly, required) => {
            return renderFieldTemplate(name, displayName, value, error, readOnly, required, (
                <Editable
                    title={name}
                    name={name}
                    dataType="select"
                    disabled={readOnly}
                    handleSubmit={this.handleSubmit}
                    value={value}
                    options={[
                        { key:'t', value: 'true', text: 'Yes' },
                        { key:'f', value: 'false', text: 'No' }]}
                />

            ));

        };

        const renderSelectField = (name, displayName, value, error, readOnly, required) => {
            let priorityError = null;
            if(error){
                priorityError = <div title = {error}
                                     style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace:'nowrap', color: '#a94442'}}>
                    {error}
                </div>;
            }

            let ref
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

            return renderFieldTemplate(name, displayName, value, error, readOnly, required, (
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

        const renderMultiSelectField = (name, displayName, value, error, readOnly, required) => {
            let priorityError = null;
            if(error){
                priorityError = <div title = {error}
                                     style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace:'nowrap', color: '#a94442'}}>
                    {error}
                </div>;
            }

            let ref
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
            const filterKeys = Object.keys(this.state.flatAvail).filter((key) => this.props.availsMapping.mappings.find((x)=>x.javaVariableName === key).configEndpoint);
            let filters = filterKeys.map((key) => {
                if(this.state.flatAvail[key] && this.props.selectValues[key]) {
                    const filt = this.state.flatAvail[key].split(',').map(val => {
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

            if(allOptions[0].options && allOptions[0].options.length > 0 && selectedVal){
                val = selectedVal.split(',').map(v => allOptions[0].options.filter(opt => opt.value === v)).flat();
            }

            let handleOptionsChange = (selectedOptions) => {
                const selVal = selectedOptions.map(({value}) => value).join(',');
                ref.current.handleChange(selVal ? selVal : null);
                setTimeout(() => {
                    this.setState({});
                }, 1);
            };

            return renderFieldTemplate(name, displayName, value, error, readOnly, required, (
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
                        options={allOptions}
                        value={val}
                        onChange={handleOptionsChange}
                    />}
                />
            ));
        };

        const renderDatepickerField = (name, displayName, value, error, readOnly, required) => {
            let priorityError = null;
            if(error){
                priorityError = <div title = {error}
                                    style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace:'nowrap', color: '#a94442'}}>
                                    {error}
                                </div>;
            }
            return renderFieldTemplate(name, displayName, value, error, readOnly, required, (
                <EditableDatePicker
                    value={value}
                    priorityDisplay={priorityError}
                    name={name}
                    disabled={readOnly}
                    displayName={displayName}
                    validate={(date) => rangeValidation(name, displayName, date, this.state.flatAvail)}
                    onChange={(date, cancel) => this.handleEditableSubmit(name, date, cancel)}
                />
            ));
        };

        const renderColumns = [];

        if(this.state.flatAvail && this.props.availsMapping) {
            const renderFields = [];
            const cannotUpdate = cannot('update', 'Avail');

            this.props.availsMapping.mappings.map((mapping)=> {
                if (EXCLUDED_FIELDS.indexOf(mapping.javaVariableName) === -1) {
                    let error = null;
                    if (this.state.avail && this.state.avail.validationErrors) {
                        this.state.avail.validationErrors.forEach(e => {
                            if (e.fieldName === mapping.javaVariableName) {
                                error = e.message;
                                if (e.sourceDetails) {
                                    if (e.sourceDetails.originalValue) error += ' \'' + e.sourceDetails.originalValue + '\'';
                                    if (e.sourceDetails.fileName) {
                                        error += ', in file ' + e.sourceDetails.fileName
                                            + ', row number ' + e.sourceDetails.rowId
                                            + ', column ' + e.sourceDetails.originalFieldName;
                                    }
                                }
                            }
                        });
                    }

                    const readOnly = cannotUpdate || READONLY_FIELDS.indexOf(mapping.javaVariableName) > -1;
                    const value = this.state.flatAvail ? this.state.flatAvail[mapping.javaVariableName] : '';
                    const required = mapping.required;
                    switch (mapping.dataType) {
                        case 'string': renderFields.push(renderTextField(mapping.javaVariableName, mapping.displayName, value, error, readOnly, required));
                            break;
                        case 'integer': renderFields.push(renderTextField(mapping.javaVariableName, mapping.displayName, value, error, readOnly, required));
                            break;
                        case 'double': renderFields.push(renderTextField(mapping.javaVariableName, mapping.displayName, value, error, readOnly, required));
                            break;
                        case 'select': renderFields.push(renderSelectField(mapping.javaVariableName, mapping.displayName, value, error, readOnly, required));
                            break;
                        case 'multiselect': renderFields.push(renderMultiSelectField(mapping.javaVariableName, mapping.displayName, value, error, readOnly, required));
                            break;
                        case 'language': renderFields.push(renderSelectField(mapping.javaVariableName, mapping.displayName, value, error, readOnly, required));
                            break;
                        case 'multilanguage': renderFields.push(renderMultiSelectField(mapping.javaVariableName, mapping.displayName, value, error, readOnly, required));
                            break;
                        case 'duration': renderFields.push(renderTextField(mapping.javaVariableName, mapping.displayName, value, error, readOnly, required));
                            break;
                         case 'time': renderFields.push(renderTextField(mapping.javaVariableName, mapping.displayName, value, error, readOnly, required));
                             break;
                        case 'date': renderFields.push(renderDatepickerField(mapping.javaVariableName, mapping.displayName, value, error, readOnly, required));
                             break;
                        case 'boolean': renderFields.push(renderBooleanField(mapping.javaVariableName, mapping.displayName, value, error, readOnly, required));
                             break;
                        default:
                            console.warn('Unsupported DataType: ' + mapping.dataType + ' for field name: ' + mapping.displayName);
                    }
                }
            });
            const perColumn = Math.ceil(renderFields.length / this.state.columns);

            for (let i = 0; i < this.state.columns; i++) {
                renderColumns.push(
                    <div key={i} className={'nx-stylish list-group col-' + 12 / this.state.columns} style={{overflowY:'scroll', height:'calc(100vh - 220px)'}}>
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
                {
                    this.state.errorMessage &&
                        <div id='avails-edit-error' className='text-danger w-100'>
                            <Label id='avails-edit-error-message' className='text-danger w-100'>
                                {this.state.errorMessage}
                            </Label>
                        </div>
                }
                {this.props.availsMapping &&
                    <div className="float-right mt-5 mx-5 px-5">
                        <Button className="mr-5" id="avails-edit-cancel-btn" color="primary" onClick={this.cancel}>Cancel</Button>
                    </div>
                }
            </div>
        );
    }
}

export default connect(mapStateToProps, null)(AvailDetails);
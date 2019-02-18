import React from 'react';
import ReactDOM from 'react-dom';
import connect from 'react-redux/es/connect/connect';
import t from 'prop-types';
import Editable from 'react-x-editable';
import config from 'react-global-configuration';
import {Button, Label} from 'reactstrap';

import {availService} from '../service/AvailService';
import EditableDatePicker from '../../../components/form/EditableDatePicker';
import {rangeValidation} from '../../../util/Validation';
import {profileService} from '../service/ProfileService';
import {cannot} from '../../../ability';
import './AvailDetails.scss';
import NexusBreadcrumb from '../../NexusBreadcrumb';
import {AVAILS_DASHBOARD} from '../../../constants/breadcrumb';

const mapStateToProps = state => {
   return {
       availsMapping: state.root.availsMapping,
   };
};

const EXCLUDED_FIELDS = ['availId'];
const READONLY_FIELDS = ['rowEdited'];

class AvailDetails extends React.Component {

    static propTypes = {
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

        this.state = {
            resolutionValidation: config.get('extraValidation.resolution'),
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
        const columns = window.innerWidth > 1240 ? 3 : (window.innerWidth > 830 ? 2 : 1);
        if(this.state.columns !== columns) //performance optimization, state changed (triggers render) only when columns number changes
            this.setState({ columns: columns });
    }

    getAvailData() {
        if(this.props.match && this.props.match.params && this.props.match.params.id){
            availService.getAvail(this.props.match.params.id)
                .then(res => {
                    if(res && res.data){
                        this.setState({
                            avail: res.data
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

    handleDatepickerSubmit(name, date, cancel) {
        this.update(name, date, () => {
            cancel();
        });
    }

    update(name, value, onError) {
        let updatedAvail = {[name]: value};
        availService.updateAvails(updatedAvail, this.state.avail.id)
            .then(res => {
                let editedAvail = res.data;
                this.setState({
                    avail: editedAvail,
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

    isAcceptable(data, acceptedValues){
        return !!(data && acceptedValues && acceptedValues.indexOf(data.trim()) > -1);

    }

    validateTextField(target, field) {
        if(this.state.resolutionValidation.fields.indexOf(field) > -1 && target.type !== 'checkbox' && target.newValue){
            target.newValue = target.newValue.toUpperCase();
        }
        const value =  target.newValue ? target.newValue.trim() : '';

        for(let i=0; i < this.props.availsMapping.mappings.length; i++){
            let mapping = this.props.availsMapping.mappings[i];
            if(mapping.javaVariableName === field) {

                if(this.state.resolutionValidation.type === 'oneOf'){
                    if(this.state.resolutionValidation.fields.indexOf(mapping.javaVariableName) > -1){
                        //if this field belongs to 'oneOf' extra validation
                        let stillInvalid = true; //is presumed invalid until one valid value is found
                        for(let j=0; j < this.state.resolutionValidation.fields.length; j++){
                            if(this.state.resolutionValidation.values == null || j >=  this.state.resolutionValidation.values.length || this.state.resolutionValidation.values[j] == null){
                                //if no required value just check against empty
                                if(this.validateNotEmpty(this.state.avail[this.state.resolutionValidation.fields[j]]) === '') stillInvalid = false;
                            }else{
                                //if the oneOf element has at least one acceptable value
                                if(this.state.resolutionValidation.fields[j] !== field){
                                    //if is another oneOf element from same group
                                    if(this.isAcceptable(this.state.avail[this.state.resolutionValidation.fields[j]], this.state.resolutionValidation.values[j])) stillInvalid=false;
                                }else{
                                    //if is current field
                                    if(this.isAcceptable(value, this.state.resolutionValidation.values[j])) return '';
                                    //if not acceptable but also not empty
                                    if(this.validateNotEmpty(value)==='') return <small>{'Only ' + this.state.resolutionValidation.values[j].join(', ') + ' or empty values are allowed'}</small>;
                                }
                            }
                        }

                        if(stillInvalid) return <small>{'At least one of the ' + this.state.resolutionValidation.values.join(', ').toUpperCase() + ' needs to have correct value'}</small>;
                        else return '';
                    }
                }
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
                    validate={(date) => rangeValidation(name, displayName, date, this.state.avail)}
                    onChange={(date, cancel) => this.handleDatepickerSubmit(name, date, cancel)}
                />
            ));
        };

        const renderColumns = [];

        if(this.state.avail && this.props.availsMapping) {
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
                    const value = this.state.avail ? this.state.avail[mapping.javaVariableName] : '';
                    const required = mapping.required;
                    switch (mapping.dataType) {
                        case 'text':
                            renderFields.push(renderTextField(mapping.javaVariableName, mapping.displayName, value, error, readOnly, required));
                            break;
                        case 'number':
                            renderFields.push(renderTextField(mapping.javaVariableName, mapping.displayName, value, error, readOnly, required));
                            break;
                        case 'year':
                            renderFields.push(renderTextField(mapping.javaVariableName, mapping.displayName, value, error, readOnly, required));
                            break;
                        case 'date':
                            renderFields.push(renderDatepickerField(mapping.javaVariableName, mapping.displayName, value, error, readOnly, required));
                            break;
                        case 'boolean':
                            renderFields.push(renderBooleanField(mapping.javaVariableName, mapping.displayName, value, error, readOnly, required));
                            break;
                        default:
                            console.warn('Unsupported DataType: ' + mapping.dataType + ' for field name: ' + mapping.displayName);
                    }
                }
            });
            const perColumn = Math.ceil(renderFields.length / this.state.columns);

            for (let i = 0; i < this.state.columns; i++) {
                renderColumns.push(
                    <div key={i} className={'nx-stylish list-group col-' + 12 / this.state.columns}>
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
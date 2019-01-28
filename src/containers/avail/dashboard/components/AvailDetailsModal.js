import React from 'react';
import { Component } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { ModalFooter, ModalHeader, Modal, Button, Label } from 'reactstrap';
import t from 'prop-types';
import Editable from 'react-x-editable';
import EditableDatePicker from '../../../../components/form/EditableDatePicker';
import { availService } from '../../service/AvailService';
import {rangeValidation} from '../../../../util/Validation';
import config from 'react-global-configuration';
import {cannot} from '../../../../ability';

class AvailDetails extends React.Component {
    static propTypes = {
        avail: t.object,
        className: t.string,
        abortLabel: t.string,
        reject: t.func,
        resolve: t.func,
        onEdit: t.func,
        availsMapping: t.any,
    };

    static defaultProps = {
        ...Component.defaultProps,
        confirmLabel: 'Yes',
        abortLabel: 'Close',
    };

    constructor(props) {
        super(props);
        this.state = {
            resolutionValidation: config.get('extraValidation.resolution'),
            modal: true,
            avail: this.props.avail,
            errorMessage: '',
        };

        this.emptyValueText = 'Enter';

        this.toggle = this.toggle.bind(this);
        this.abort = this.abort.bind(this);
        this.update = this.update.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDatepickerSubmit = this.handleDatepickerSubmit.bind(this);
        this.validateTextField = this.validateTextField.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    abort() {
        return this.props.reject();
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
        let updatedAvail = {id: this.state.avail.id, [name]: value};
        availService.updateAvails(updatedAvail)
        .then(res => {
            let editedAvail = res.data;
            this.setState({
                avail: editedAvail,
                errorMessage: ''
            });
            this.props.onEdit(editedAvail);
        })
        .catch(() => {
            this.setState({
                errorMessage: 'Avail edit failed'
            });
            onError();
        });
    }


    validateNotEmpty(data) {
        return data.trim() ? '' : 'Field can not be empty';
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
                if(!mapping.required) return '';

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
                                   if(this.validateNotEmpty(value)==='') return 'Only ' + this.state.resolutionValidation.values[j].join(', ') + ' or empty values are allowed';
                                }
                            }
                        }

                        if(stillInvalid) return 'At least one of the ' + this.state.resolutionValidation.values.join(', ').toUpperCase() + ' needs to have correct value';
                        else return '';
                    }
                }
                return this.validateNotEmpty(value);
            }

        }
        return '';
    }

    render() {
        const rowsOnLeft = Math.floor(this.props.availsMapping.mappings.length / 2) + 1; //+1 because we skip the 'availId' present in this array
        const renderFieldTemplate = (name, displayName, error, content) => {
            const hasValidationError = !this.state.avail[name] && error;
            return (
                <div href="#" key={name}
                    className="list-group-item list-group-item-action flex-column align-items-start"
                    style={{backgroundColor: hasValidationError ? '#f2dede' : null,
                            color: hasValidationError ? '#a94442' : null
                        }}>
                    <div className="row">
                        <div className="col-4">{displayName}:</div>
                        <div
                            className={'col-8' + (this.state.avail[name] ? '' : ' empty')}
                            id={'dashboard-avails-detail-modal-' + name + '-field'}>
                            {content}
                        </div>
                    </div>
                </div>
            );
        };
        const renderTextField = (name, displayName, error) => {
            const ref = React.createRef();
            const displayFunc = (value) => {
                if(error){
                    return (<div title = {error}
                        style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace:'nowrap',
                                color: error ? '#a94442' : null
                            }}
                        > {error} </div>);
                }else{
                    return value;
                }
            };

            return renderFieldTemplate(name, displayName, error, (
                <Editable
                    ref={ref}
                    title={name}
                    value={this.state.avail[name]}
                    disabled={cannot('update', 'Avail')}
                    dataType="text"
                    mode="inline"
                    placeholder={this.emptyValueText + ' ' + displayName}
                    handleSubmit={this.handleSubmit}
                    emptyValueText={displayFunc(this.emptyValueText + ' ' + displayName)}
                    validate={() => this.validateTextField(ref.current, name)}
                />
            ));
        };
        const renderBooleanField = (name, displayName, error) => {
            return renderFieldTemplate(name, displayName, error, (
                <Editable
                    title={name}
                    name={name}
                    dataType="select"
                    disabled={cannot('update', 'Avail')}
                    handleSubmit={this.handleSubmit}
                    value={this.state.avail[name]}
                    options={[
                        { key:'t', value: 'true', text: 'Yes' },
                        { key:'f', value: 'false', text: 'No' }]}
                /> 
                
            ));

    };
    const renderDatepickerField = (name, displayName, error) => {
        let priorityError = null;
        if(!this.state.avail[name] && error){
            priorityError = <div title = {error}
                                style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace:'nowrap', color: '#a94442'}}>
                                {error}
                            </div>;
        }
        return renderFieldTemplate(name, displayName, error, (
            <EditableDatePicker
                value={this.state.avail[name]}
                priorityDisplay={priorityError}
                name={name}
                disabled={cannot('update', 'Avail')}
                displayName={displayName}
                validate={(date) => rangeValidation(name, displayName, date, this.state.avail)}
                onChange={(date, cancel) => this.handleDatepickerSubmit(name, date, cancel)}
            />
        ));
    };
    const renderFields = (mappings) => {
        return mappings.map((mapping) => {
            if(mapping.javaVariableName !== 'availId'){//we shouldn't be able to modify the id
                let error = null;
                if(this.state.avail.validationErrors){
                    this.state.avail.validationErrors.forEach( e => {
                        if(e.fieldName === mapping.javaVariableName){
                            error = e.message;
                            if(e.sourceDetails){
                                if(e.sourceDetails.originalValue) error += ' \'' + e.sourceDetails.originalValue + '\'';
                                if(e.sourceDetails.fileName){
                                    error += ', in file ' + e.sourceDetails.fileName
                                           + ', row number ' + e.sourceDetails.rowId
                                           + ', column ' + e.sourceDetails.originalFieldName;
                                }
                            }
                            return;
                        }
                    });
                }
                switch (mapping.dataType) {
                    case 'text': return renderTextField(mapping.javaVariableName, mapping.displayName, error);
                    case 'number': return renderTextField(mapping.javaVariableName, mapping.displayName, error);
                    case 'year': return renderTextField(mapping.javaVariableName, mapping.displayName, error);
                    case 'date': return renderDatepickerField(mapping.javaVariableName, mapping.displayName, error);
                    case 'boolean': return renderBooleanField(mapping.javaVariableName, mapping.displayName, error);
                    default:
                        console.warn('Unsupported DataType: ' + mapping.dataType + ' for field name: ' + mapping.displayName);
                }
            }
        });
    };

    return(
            <Modal isOpen = { this.state.modal } toggle = { this.toggle } className = { this.props.className + ' lgModalBox' } fade = { false} backdrop = { false} size = {'lg'} >
            <ModalHeader toggle={this.toggle}>Avail Details</ModalHeader>
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
                {
            this.state.errorMessage &&
                <ModalFooter id="dashboard-avails-create-modal-error-message" className="text-danger w-100">
                    <Label id="dashboard-avails-create-modal-error-message" className="text-danger w-100">
                        {this.state.errorMessage}
                    </Label>
                </ModalFooter>
                }
            <ModalFooter>
                <Button color="primary" onClick={this.abort}>{this.props.abortLabel}</Button>
            </ModalFooter>

            </Modal >
        );
    }
}


export const availDetailsModal = {
    open: (avail, onApprove, onCancel, options) => {
        if (options == null) {
            options = {};
        }
        const props = {
            ...options,
            avail: avail,
            resolve: () => {
                cleanup();
                onApprove();
            },
            reject: () => {
                cleanup();
                onCancel();
            }
        };
        const wrapper = document.body.appendChild(document.createElement('div'));
        render(<AvailDetails {...props} />, wrapper);
        const cleanup = function () {
            unmountComponentAtNode(wrapper);
            return setTimeout(function () {
                return wrapper.remove();
            });
        };
    }
};

export default AvailDetails;

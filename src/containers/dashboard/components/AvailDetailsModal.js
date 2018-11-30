import React from 'react';
import { Component } from 'react';
import moment from 'moment';
import { render, unmountComponentAtNode } from 'react-dom';
import { ModalFooter, ModalHeader, Modal, Button, Label } from 'reactstrap';
import t from 'prop-types';
import Editable from 'react-x-editable';
import EditableDatePicker from '../../../components/fields/EditableDatePicker';
import { dashboardService } from '../DashboardService';
import config from 'react-global-configuration';

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
        this.handleSubmit = this.handleSubmit.bind(this);
        this.notifyOtherSystems = this.notifyOtherSystems.bind(this);
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
        let value = editable.value ? editable.value.trim() : editable.value;
        let updatedAvail = {...this.state.avail, [editable.props.title]: value};
        this.notifyOtherSystems(updatedAvail);
    }

    notifyOtherSystems(updatedAvail){
        dashboardService.updateAvails(updatedAvail)
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
            });
    }


    validateNotEmpty(data) {
        if (!data.trim()) {
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
                                   if(this.validateNotEmpty(value)==='') return 'Value not acceptable';
                                }
                            }
                        }

                        if(stillInvalid) return 'Not all formats can be empty';
                        else return '';
                    }
                }
                return this.validateNotEmpty(value);
            }

        }
        return '';
    }

    validation(name, displayName, date) {
         let startDate, endDate, rangeError;

        if (name.endsWith('Start') && this.state.avail[name.replace('Start', 'End')]) {
            startDate = date;
            endDate = this.state.avail[name.replace('Start', 'End')];
            rangeError = displayName + ' must be before corresponding end date';
        } else if (name.endsWith('End') && this.state.avail[name.replace('End', 'Start')]) {
            startDate = this.state.avail[name.replace('End', 'Start')];
            endDate = date;
            rangeError = displayName + ' must be after corresponding end date';
        }
        if (startDate && endDate && moment(endDate) < moment(startDate)) {
            return rangeError;
        }
    }

    handleDatepickerChange(name, date) {
        let newAvail = { ...this.state.avail };
        newAvail[name] = date;
        this.notifyOtherSystems(newAvail);

    }

    isAnyErrors(errorMessage) {
        return !!(errorMessage.other || errorMessage.date);
    }

    render() {
        const rowsOnLeft = Math.floor(this.props.availsMapping.mappings.length / 2) + 1; //+1 because we skip the 'availId' present in this array
        const renderFieldTemplate = (name, displayName, content) => {
            return (
                <div href="#" key={name}
                    className="list-group-item list-group-item-action flex-column align-items-start">
                    <div className="row">
                        <div className="col-4">{displayName}:</div>
                        <div className={'col' + (this.state.avail[name] ? '' : ' empty')} >
                            {content}
                        </div>
                    </div>
                </div>
            );
        };
        const renderTextField = (name, displayName) => {
            const ref = React.createRef();
            return renderFieldTemplate(name, displayName, (
                <Editable
                    ref={ref}
                    title={name}
                    id={'dashboard-avails-detail-modal-' + name + '-text'}
                    value={this.state.avail[name]}
                    dataType="text"
                    mode="inline"
                    placeholder={this.emptyValueText + ' ' + displayName}
                    handleSubmit={this.handleSubmit}
                    emptyValueText={this.emptyValueText + ' ' + displayName}
                    validate={() => this.validateTextField(ref.current, name)}
                />
            ));
        };
        const renderBooleanField = (name, displayName) => {
            return renderFieldTemplate(name, displayName, (
                <Editable
                    title={name}
                    name={name}
                    id={'dashboard-avails-detail-modal-' + name + '-select'}
                    dataType="select"
                    handleSubmit={this.handleSubmit}
                    value={this.state.avail[name]}
                    options={[
                        { key:'t', value: 'true', text: 'Yes' },
                        { key:'f', value: 'false', text: 'No' }]}
                /> 
                
            ));

    };
    const renderDatepickerField = (name, displayName) => {
        return renderFieldTemplate(name, displayName, (
            <EditableDatePicker
                value={this.state.avail[name]}
                name={name}
                displayName={displayName}
                validate={(date) => this.validation(name, displayName, date)}
                onChange={(date) => this.handleDatepickerChange(name, date)}
            />
        ));
    };
    const renderFields = (mappings) => {
        return mappings.map((mapping) => {
            if(mapping.javaVariableName!='availId'){//we shouldn't be able to modify the id
                switch (mapping.dataType) {
                    case 'text': return renderTextField(mapping.javaVariableName, mapping.displayName);
                    case 'number': return renderTextField(mapping.javaVariableName, mapping.displayName);
                    case 'year': return renderTextField(mapping.javaVariableName, mapping.displayName); //yeah, somebody put type 'year' for Release Year Field, this is a quick fix
                    case 'date': return renderDatepickerField(mapping.javaVariableName, mapping.displayName);
                    case 'boolean': return renderBooleanField(mapping.javaVariableName, mapping.displayName);
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
                        {this.state.errorMessage.other} {this.state.errorMessage.date} {this.state.errorMessage.range}
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

import React from 'react';
import { Component } from 'react';
import moment from 'moment';
import { render, unmountComponentAtNode } from 'react-dom';
import { ModalFooter, ModalHeader, Modal, Button, Label } from 'reactstrap';
import t from 'prop-types';
import Editable from 'react-x-editable';
import EditableDatePicker from '../../../components/fields/EditableDatePicker';
import { dashboardService } from '../DashboardService';

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
            modal: true,
            avail: this.props.avail,
            errorMessage: '',
        };

        this.emptyValueText = 'Enter';

        this.toggle = this.toggle.bind(this);
        this.abort = this.abort.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.notifyOtherSystems = this.notifyOtherSystems.bind(this);
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
        let updatedAvail = {...this.state.avail, [editable.props.title]: editable.value};
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
        if (!data) {
            return 'Field can not be empty';
        }
        return '';
    }

    validateTextField(field, value) {
        if(this.validateNotEmpty(value) === '') return '';
        let atLeastOne = ['sd', 'hd', 'f3d', 'f4k'];
        for(let i=0; i < this.props.availsMapping.mappings.length; i++){
            let mapping = this.props.availsMapping.mappings[i];
            if(mapping.javaVariableName === field) {
                if(!mapping.required) return '';

                if(atLeastOne.indexOf(mapping.javaVariableName) > -1){
                    for(let j=0; j < atLeastOne.length; j++){
                        if(atLeastOne[j]!=field && this.validateNotEmpty(this.state.avail[atLeastOne[j]]) === '') return '';
                    }

                    if(this.validateNotEmpty(value)!='') return 'Not all formats can be empty';
                }

                return this.validateNotEmpty(value);
            }

        }
        return '';
    }

    handleChange({ target }) {
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        if(validateTextField(name, value)===''){
            let newAvail = { ...this.state.avail, [name]: value };
            this.setState({
                avail: newAvail
            });
        }
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
            return renderFieldTemplate(name, displayName, (
                <Editable
                    title={name}
                    id={'dashboard-avails-detail-modal-' + name + '-text'}
                    value={this.state.avail[name]}
                    dataType="text"
                    mode="inline"
                    placeholder={this.emptyValueText + ' ' + displayName}
                    handleSubmit={this.handleSubmit}
                    emptyValueText={this.emptyValueText + ' ' + displayName}
                    onChange={this.handleChange}
                    validate={(value) => this.validateTextField(name, value)}
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
                    onChange={this.handleChange}
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

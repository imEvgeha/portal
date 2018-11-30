import React from 'react';
import { Component } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { ModalFooter, ModalHeader, Modal, Button, Label } from 'reactstrap';
import t from 'prop-types';
import Editable from 'react-x-editable';
import EditableDatePicker from '../../../components/fields/EditableDatePicker';
import { dashboardService } from '../DashboardService';
import {rangeValidation} from '../../../util/Validation';

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
        this.update = this.update.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDatepickerSubmit = this.handleDatepickerSubmit.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    abort() {
        return this.props.reject();
    }

    validateNotEmpty(data) {
        if (!data) {
            return 'Field can not be empty';
        }
    }

    handleChange({ target }) {
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        let newAvail = { ...this.state.avail, [name]: value };
        this.setState({
            avail: newAvail
        });

        this.setDisableCreate(newAvail, this.state.errorMessage);
    }

    handleSubmit(editable) {
        const name = editable.props.title;
        const value = editable.value;
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
        let updatedAvail = {...this.state.avail, [name]: value};
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
            onError();
        });
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
                    validate={ name !== 'title' && name !== 'studio' ? '' : this.validateNotEmpty }
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
                validate={(date) => rangeValidation(name, displayName, date, this.state.avail)}
                onChange={(date, cancel) => this.handleDatepickerSubmit(name, date, cancel)}
            />
        ));
    };
    const renderFields = (mappings) => {
        return mappings.map((mapping) => {
            if(mapping.javaVariableName!='availId'){//we shouldn't be able to modify the id
                switch (mapping.dataType) {
                    case 'text': return renderTextField(mapping.javaVariableName, mapping.displayName);
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

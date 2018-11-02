import React from 'react';
import {Component} from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {ModalFooter, ModalHeader, Modal, Button, Label, Input, Progress} from 'reactstrap';
import t from 'prop-types';
import DatePicker from 'react-datepicker/es';
import {dashboardService} from '../DashboardService';
import moment from 'moment';

class AvailCreate extends React.Component {
    static propTypes = {
        className: t.string,
        abortLabel: t.string,
        confirmLabel: t.string,
        reject: t.func,
        resolve: t.func,
        availsMapping: t.any,
    };

    static defaultProps = {
        ...Component.defaultProps,
        confirmLabel: 'Submit',
        abortLabel: 'Cancel',
    };

    constructor(props) {
        super(props);
        this.state = {
            modal: true,
            disableCreateBtn: true,
            showCreatedMessage: false,
            loading: false,
            errorMessage: {
                date: '',
                range: '',
                other: ''
            },
            avail: {
                title: null,
                studio: null,
                territory: null,
                genre: null,
                vodStart: null,
                vodEnd: null
            }
        };

        this.toggle = this.toggle.bind(this);
        this.abort = this.abort.bind(this);
        this.confirm = this.confirm.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDatepickerChange = this.handleDatepickerChange.bind(this);
        this.handleDatepickerRawChange = this.handleDatepickerRawChange.bind(this);
    }

    handleChange({target}) {
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        let newAvail = {...this.state.avail, [name]: value};
        this.setState({
            avail: newAvail
        });

        this.setDisableCreate(newAvail, this.state.errorMessage);
    }

    handleDatepickerChange(name, displayName, date) {
        let newAvail = {...this.state.avail};
        newAvail[name] = date;
        let errorMessage = {...this.state.errorMessage, range: '', date: ''};

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

        if (startDate && endDate && endDate < startDate) {
            errorMessage.range = rangeError;
        }

        this.setState({
            avail: newAvail,
            errorMessage: errorMessage
        });

        this.setDisableCreate(newAvail, errorMessage);
    }

    handleDatepickerRawChange(name, displayName, date) {
        if (moment(date).isValid() || !date) {
            this.handleDatepickerChange(name, displayName, moment(date));
        } else {
            this.setState({errorMessage: {...this.state.errorMessage, date: 'Invalid date: ' + displayName}});
        }
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    abort() {
        return this.props.reject();
    }

    setDisableCreate(avail, errorMessage) {
        if (this.isAnyErrors(errorMessage)) {
            this.setState({disableCreateBtn: true});
        } else if (this.areMandatoryFieldsEmpty(avail)) {
            this.setState({disableCreateBtn: true});
        } else {
            this.setState({disableCreateBtn: false});
        }
    }

    isAnyErrors(errorMessage) {
        return !!(errorMessage.other || errorMessage.date);
    }

    areMandatoryFieldsEmpty(avail) {
        return !(avail.title && avail.studio);
    }

    confirm() {
        this.setState({loading: true, showCreatedMessage: false});
        dashboardService.createAvail(this.state.avail).then(() => {
            this.setState({loading: false, showCreatedMessage: true});
            let thatAbort = this.abort;
            setTimeout(function () {
                thatAbort();
            }, 1000);
        })
            .catch(() => this.setState({loading: false, errorMessage: {...this.state.errorMessage, other: 'Avail creation Failed'}}));
        return this.props.resolve();
    }



    render() {
        const rowsOnLeft = this.props.availsMapping.mappings.length/2;

        const renderFieldTemplate = (name, displayName, content) => {
            return (
                <a href="#" key={name}
                   className="list-group-item list-group-item-action flex-column align-items-start">
                    <div className="row">
                        <div className="col-4">{displayName}:</div>
                        <div className="col">
                            {content}
                        </div>
                    </div>
                </a>
            );
        };

        const renderTextField = (name, displayName) => {
            return renderFieldTemplate(name, displayName, (
                <Input type="text" name={name} id={'dashboard-avails-create-modal-' + name + '-text'} placeholder={'Enter ' + displayName}
                       onChange={this.handleChange}/>
            ));
        };

        const renderBooleanField = (name, displayName) => {
            return renderFieldTemplate(name, displayName, (
                <select className="form-control"
                        name={name}
                        id={'dashboard-avails-create-modal-' + name + '-select'}
                        placeholder={'Enter ' + displayName}
                        value={this.state.avail[name]}
                        onChange={this.handleChange}>
                    <option value="">None selected</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </select>
            ));
        };

        const renderDatepickerField = (name, displayName) => {
            return renderFieldTemplate(name, displayName, (
                <DatePicker
                    id={'dashboard-avails-create-modal-' + name + '-text'}
                    name={name}
                    selected={this.state.avail[name]}
                    onChange={(date) => this.handleDatepickerChange(name, displayName, date)}
                    onChangeRaw={(event) => this.handleDatepickerRawChange(name, displayName, event.target.value)}
                    todayButton={'Today'}
                />
            ));
        };

        const renderFields = (mappings) => {
            return mappings.map((mapping)=> {
                switch (mapping.dataType) {
                    case 'text' : return renderTextField(mapping.javaVariableName, mapping.displayName);
                    case 'date' : return renderDatepickerField(mapping.javaVariableName, mapping.displayName);
                    case 'boolean' : return renderBooleanField(mapping.javaVariableName, mapping.displayName);
                    default:
                        console.warn('Unsupported DataType: ' + mapping.dataType + ' for field name: ' + mapping.displayName);
                }
            });
        };

        return (
            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} fade={false} backdrop={false} size={'lg'}>
                <ModalHeader toggle={this.toggle}>Create Avail</ModalHeader>
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
                {this.state.loading && <Progress className={'custom-progress'} animated value={100}/>}
                <ModalFooter>
                    <Label id="dashboard-avails-create-modal-error-message"
                           className="text-success w-100">{this.state.showCreatedMessage && 'Avails created'}</Label>
                    <Label id="dashboard-avails-create-modal-error-message" className="text-danger w-100">
                        {this.state.errorMessage.other} {this.state.errorMessage.date} {this.state.errorMessage.range}
                    </Label>
                    <Button id="dashboard-avails-create-modal-create-btn" color="primary" disabled={this.state.disableCreateBtn}
                            onClick={this.confirm}>{this.props.confirmLabel}</Button>
                    <Button id="dashboard-avails-create-modal-cancel-btn" color="primary" onClick={this.abort}>{this.props.abortLabel}</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export const availCreateModal = {
    open: (onApprove, onCancel, options) => {
        if (options == null) {
            options = {};
        }
        const props = {
            ...options,
            resolve: () => {
                onApprove();
            },
            reject: () => {
                cleanup();
                onCancel();
            }
        };
        const wrapper = document.body.appendChild(document.createElement('div'));
        render(<AvailCreate {...props}/>, wrapper);
        const cleanup = function () {
            unmountComponentAtNode(wrapper);
            return setTimeout(function () {
                return wrapper.remove();
            });
        };
    }
};
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
            errorMessage: {
                date: '',
                range: '',
                other: ''
            },
        };

        this.emptyValueText = 'Enter';

        this.toggle = this.toggle.bind(this);
        this.abort = this.abort.bind(this);
        this.confirm = this.confirm.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        if (this.state.avail.vodStart) {
            this.setState({
                avail: {
                    ...this.state.avail,
                    vodStart: moment(this.state.avail.vodStart).format('L')
                }
            });
        }
        if (this.state.avail.vodEnd) {
            this.setState({
                avail: {
                    ...this.state.avail,
                    vodEnd: moment(this.state.avail.vodEnd).format('L')
                }
            });
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

    confirm() {
        this.setState({ loading: true, showCreatedMessage: false });
        dashboardService.updateAvails(this.state.avail).then(() => {
            this.setState({ loading: false, showCreatedMessage: true });
            let thatAbort = this.abort;
            setTimeout(function () {
                thatAbort();
            }, 1000);
        })
            .catch(() => this.setState({ loading: false, errorMessage: { ...this.state.errorMessage, other: 'Avail update Failed' } }));
        return this.props.resolve();
    }

    handleSubmit(editable) {
        this.props.onEdit(editable, this);
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

    validation(name, displayName, date) {
        let errorMessage = { ...this.state.errorMessage, range: '', date: '' };
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
            errorMessage.range = rangeError;
            return rangeError;
        }
        this.setState({
            errorMessage: errorMessage
        });

    }

    handleDatepickerChange(name, date) {
        let newAvail = { ...this.state.avail };
        newAvail[name] = date;
        this.setState({
            avail: newAvail,
        });

        this.confirm();
    }
    setDisableCreate(avail, errorMessage) {
        if (this.isAnyErrors(errorMessage)) {
            this.setState({ disableCreateBtn: true });
        } else if (this.areMandatoryFieldsEmpty(avail)) {
            this.setState({ disableCreateBtn: true });
        } else {
            this.setState({ disableCreateBtn: false });
        }
    }
    isAnyErrors(errorMessage) {
        return !!(errorMessage.other || errorMessage.date);
    }

    areMandatoryFieldsEmpty(avail) {
        return !(avail.title && avail.studio);
    }

    render() {
        const rowsOnLeft = this.props.availsMapping.mappings.length / 2;

        const renderFieldTemplate = (name, displayName, content) => {
            return (
                <a href="#" key={name}
                    className="list-group-item list-group-item-action flex-column align-items-start">
                    <div className="row">
                        <div className="col-4">{displayName}:</div>
                        <div className={'col' + (this.state.avail[name] ? '' : ' empty')} >
                            {content}
                        </div>
                    </div>
                </a>
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
                    validate={this.validateNotEmpty}
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
                validate={(date) => this.validation(name, displayName, moment(date))}
                onChange={(date) => this.handleDatepickerChange(name, displayName, moment(date))}
            />
        ));
    };
    const renderFields = (mappings) => {
        return mappings.map((mapping) => {
            switch (mapping.dataType) {
                case 'text': return renderTextField(mapping.javaVariableName, mapping.displayName);
                case 'date': return renderDatepickerField(mapping.javaVariableName, mapping.displayName);
                case 'boolean': return renderBooleanField(mapping.javaVariableName, mapping.displayName);
                default:
                    console.warn('Unsupported DataType: ' + mapping.dataType + ' for field name: ' + mapping.displayName);
            }
        });
    };

    return(
            <Modal isOpen = { this.state.modal } toggle = { this.toggle } className = { this.props.className + ' lgModalBox' } fade = { false} backdrop = { false} size = { 'lg'} >
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

import React from 'react';
import {Component} from 'react';
import moment from 'moment';
import Editable from 'react-x-editable';
import {render, unmountComponentAtNode} from 'react-dom';
import {ModalFooter, ModalHeader, Modal, Button, Label} from 'reactstrap';
import {validateDate} from '../../../util/Validation';
import t from 'prop-types';

class AvailDetails extends React.Component{
    static propTypes = {
        avail: t.object,
        className: t.string,
        abortLabel: t.string,
        reject: t.func,
        resolve: t.func
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
            availLastEditSucceed: true,
            errorMessage: ''
        };

        this.emptyValueText = 'Empty field';

        this.toggle = this.toggle.bind(this);
        this.abort = this.abort.bind(this);
        this.confirm = this.confirm.bind(this);
        this.handleSubmitSucc = this.handleSubmitSucc.bind(this);
        this.handleSubmitFail = this.handleSubmitFail.bind(this);

        this.validateStartDateFormat = this.validateStartDateFormat.bind(this);
        this.validateEndDateFormat = this.validateEndDateFormat.bind(this);
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
        return this.props.resolve();
    }

    handleSubmitSucc(editable) {
        console.log(editable);
        let updatedAvail = {...this.state.avail, [editable.props.title]: editable.value};
        console.log(updatedAvail);
        this.updateAvailsSucc(updatedAvail).then(res => {
            this.setState({
                avail: res,
                availLastEditSucceed: true
            });
            console.log(res);
        });
    }

    handleSubmitFail(editable) {
        console.log(editable);
        let updatedAvail = {...this.state.avail, [editable.props.title]: editable.value};
        this.updateAvailsFail(updatedAvail).then(res => {
            this.setState({
                avail: res
            });
        }).catch(() => {
            editable.setState({availLastEditSucceed: false});
            this.setState({
                availLastEditSucceed: false,
                errorMessage: 'Avail edit failed'});
            editable.value = this.state.avail[editable.props.title];
            editable.newValue = this.state.avail[editable.props.title];

            console.log(this.state.avail);
        });
    }

    updateAvailsSucc(avail) {
        return new Promise((resolve) => {
            setTimeout(function () {
                resolve(avail);
            }, 2000);
        });
    }

    updateAvailsFail(avail) {
        return new Promise((resolve, reject) => {
            setTimeout(function () {
                reject(avail);
            }, 2000);
        });
    }

    validateStartDateFormat(date) {
        let valid = validateDate(date);
        console.log(valid);
        if(!valid) {
            return 'Incorrect date';
        }
        if(moment(date) > moment(this.state.avail.availEnd)) {
            return 'Start date must be before end date';
        }
    }

    validateEndDateFormat(date) {
        let valid = validateDate(date);
        console.log(valid);
        if(!valid) {
            return 'Incorrect date';
        }
        if(moment(date) < moment(this.state.avail.availStart)) {
            return 'End date must be before end start';
        }
    }

    render() {
        return (
            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} fade={false} backdrop={false}>
                <ModalHeader toggle={this.toggle}>Avail Details</ModalHeader>
                <div className="list-group">
                    <div className="list-group-item list-group-item-action flex-column align-items-start">
                        <div className="row">
                            <div className="col-4">ID:</div>
                            <div className="col">{this.props.avail.id}</div>
                        </div>
                    </div>
                    <div className="list-group-item list-group-item-action flex-column align-items-start">
                        <div className="row">
                            <div className="col-4">Title:</div>
                            <div className="col">
                                <Editable
                                    title = "title"
                                    value = {this.state.avail.title}
                                    dataType = "text"
                                    mode = "inline"
                                    emptyValueText = {this.emptyValueText}
                                    handleSubmit={this.handleSubmitSucc}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="list-group-item list-group-item-action flex-column align-items-start">
                        <div className="row">
                            <div className="col-4">Studio:</div>
                            <div className="col">
                                <Editable
                                    title = "studio"
                                    value = {this.state.avail.studio}
                                    dataType = "text"
                                    mode = "inline"
                                    emptyValueText = {this.emptyValueText}
                                    handleSubmit={this.handleSubmitFail}
                                />
                                </div>
                        </div>
                    </div>
                    <div className="list-group-item list-group-item-action flex-column align-items-start">
                        <div className="row">
                            <div className="col-4">Territory:</div>
                            <div className="col">
                                <Editable
                                    title = "territory"
                                    value = {this.state.avail.territory}
                                    dataType = "text"
                                    mode = "inline"
                                    emptyValueText = {this.emptyValueText}
                                    handleSubmit={this.handleSubmitSucc}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="list-group-item list-group-item-action flex-column align-items-start">
                        <div className="row">
                            <div className="col-4">Genre:</div>
                            <div className="col">
                                <Editable
                                    title = "genre"
                                    value = {this.state.avail.genre}
                                    dataType = "text"
                                    mode = "inline"
                                    emptyValueText = {this.emptyValueText}
                                    handleSubmit={this.handleSubmitSucc}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="list-group-item list-group-item-action flex-column align-items-start">
                        <div className="row">
                            <div className="col-4">Avail Start Date:</div>
                            <div className="col">
                                <Editable
                                    title = "availStart"
                                    value = {this.state.avail.availStart}
                                    dataType = "text"
                                    mode = "inline"
                                    emptyValueText = {this.emptyValueText}
                                    handleSubmit={this.handleSubmitSucc}
                                    validate={this.validateStartDateFormat}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="list-group-item list-group-item-action flex-column align-items-start">
                        <div className="row">
                            <div className="col-4">Avail End Date:</div>
                            <div className="col">
                                <Editable
                                    title = "availEnd"
                                    value = {this.state.avail.availEnd}
                                    dataType = "text"
                                    mode = "inline"
                                    emptyValueText = {this.emptyValueText}
                                    handleSubmit={this.handleSubmitSucc}
                                    validate={this.validateEndDateFormat}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <ModalFooter>
                    <Label hidden = {!this.state.availLastEditSucceed}>{this.state.errorMessage}</Label>
                    <Button color="primary" onClick={this.abort}>{this.props.abortLabel}</Button>
                </ModalFooter>
            </Modal>
        );
    }
}


export const availDetailsModal = {
    open: (avail, onApprove, onCancel, options) =>{
        if (options == null) {
            options = {};
        }
        const props = {
            ...options,
            avail: avail,
            resolve: () => { cleanup();onApprove();},
            reject: () => { cleanup();onCancel();}
        };
        const wrapper = document.body.appendChild(document.createElement('div'));
        render(<AvailDetails {...props}/>, wrapper);
        const cleanup = function() {
            unmountComponentAtNode(wrapper);
            return setTimeout(function() {
                return wrapper.remove();
            });
        };
    }
};

export default AvailDetails;

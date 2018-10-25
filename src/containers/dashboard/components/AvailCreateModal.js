import React from 'react';
import {Component} from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {ModalFooter, ModalHeader, Modal, Button, Label, Input, Progress} from 'reactstrap';
import t from 'prop-types';
import DatePicker from 'react-datepicker/es';
import {dashboardService} from '../DashboardService';

class AvailCreate extends React.Component {
    static propTypes = {
        className: t.string,
        abortLabel: t.string,
        confirmLabel: t.string,
        reject: t.func,
        resolve: t.func
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
            errorMessage: '',
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
        this.handleChangeVodStartDate = this.handleChangeVodStartDate.bind(this);
        this.handleChangeVodEndDate = this.handleChangeVodEndDate.bind(this);
    }

    handleChangeVodStartDate(date) {
        let newAvail = {...this.state.avail, vodStart: date};
        let errorMessage = '';

        if (this.state.avail.vodEnd && this.state.avail.vodEnd < date) {
            errorMessage = 'Start date must be before end date';
        }

        this.setState({
            avail: newAvail,
            errorMessage: errorMessage
        });

        this.setDisableCreate(newAvail, errorMessage);
    }

    handleChangeVodEndDate(date) {
        let newAvail = {...this.state.avail, vodEnd: date};
        let errorMessage = '';

        if (this.state.avail.vodStart && this.state.avail.vodStart > date) {
            errorMessage = 'End date must be after start date';
        }
        this.setState({
            avail: newAvail,
            errorMessage: errorMessage
        });

        this.setDisableCreate(newAvail, errorMessage);
    }

    handleChange({target}) {
        const value = target.value;
        const name = target.name;

        let newAvail = {...this.state.avail, [name]: value};
        this.setState({
            avail: newAvail
        });

        this.setDisableCreate(newAvail, this.state.errorMessage);
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
        if (errorMessage) {
            this.setState({disableCreateBtn: true});
        } else if (this.isAnyEmptyField(avail)) {
            this.setState({disableCreateBtn: true});
        } else {
            this.setState({disableCreateBtn: false});
        }
    }

    isAnyEmptyField(avail) {
        for (let availField in avail) {
            if (!avail[availField]) {
                return true;
            }
        }
        return false;
    }

    confirm() {
        console.log(this.state.avail);
        this.setState({loading: true, showCreatedMessage: false});
        dashboardService.createAvail(this.state.avail).then(() => {
            this.setState({loading: false, showCreatedMessage: true});
            let thatAbort = this.abort;
            setTimeout(function(){ thatAbort(); }, 1000);
        })
            .catch(() => this.setState({loading: false, errorMessage: 'Avail creation Failed'}));
        return this.props.resolve();
    }

    render() {
        return (
            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} fade={false} backdrop={false}>
                <ModalHeader toggle={this.toggle}>Create Avail</ModalHeader>
                <div className="nx-stylish list-group">
                    <a href="#"
                       className="list-group-item list-group-item-action flex-column align-items-start">
                        <div className="row">
                            <div className="col-4">Title:</div>
                            <div className="col">
                                <Input type="text" name="title" id="dashboard-avails-create-modal-title" placeholder="Enter title"
                                       onChange={this.handleChange}/>
                            </div>
                        </div>
                    </a>
                    <a href="#"
                       className="list-group-item list-group-item-action flex-column align-items-start">
                        <div className="row">
                            <div className="col-4">Studio:</div>
                            <div className="col">
                                <Input type="text" name="studio" id="avail-create-modal-studio" placeholder="Enter studio" onChange={this.handleChange}/>
                            </div>
                        </div>
                    </a>
                    <a href="#"
                       className="list-group-item list-group-item-action flex-column align-items-start">
                        <div className="row">
                            <div className="col-4">Territory:</div>
                            <div className="col">
                                <Input type="text" name="territory" id="dashboard-avails-create-modal-territory" placeholder="Enter territory"
                                       onChange={this.handleChange}/>
                            </div>
                        </div>
                    </a>
                    <a href="#"
                       className="list-group-item list-group-item-action flex-column align-items-start">
                        <div className="row">
                            <div className="col-4">Genre:</div>
                            <div className="col">
                                <Input type="text" name="genre" id="dashboard-avails-create-modal-genre" placeholder="Enter genre"
                                       onChange={this.handleChange}/>
                            </div>
                        </div>
                    </a>
                    <a href="#"
                       className="list-group-item list-group-item-action flex-column align-items-start">
                        <div className="row">
                            <div className="col-4">VOD Start:</div>
                            <div className="col">
                                <DatePicker
                                    id="dashboard-avails-create-modal-start-date-text"
                                    selected={this.state.avail.vodStart}
                                    onChange={this.handleChangeVodStartDate}
                                    todayButton={'Today'}
                                />
                            </div>
                        </div>
                    </a>
                    <a href="#"
                       className="list-group-item list-group-item-action flex-column align-items-start">
                        <div className="row">
                            <div className="col-4">VOD End:</div>
                            <div className="col">
                                <DatePicker
                                    id="dashboard-avails-create-modal-end-date-text"
                                    selected={this.state.avail.vodEnd}
                                    onChange={this.handleChangeVodEndDate}
                                    todayButton={'Today'}
                                />
                            </div>
                        </div>
                    </a>
                </div>
                {this.state.loading && <Progress animated value={100}/>}
                <ModalFooter>
                    <Label id="dashboard-avails-create-modal-error-message" className="text-success w-100">{this.state.showCreatedMessage && 'Avails created'}</Label>
                    <Label id="dashboard-avails-create-modal-error-message" className="text-danger w-100">{this.state.errorMessage}</Label>
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
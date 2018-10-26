import React from 'react';
import {Component} from 'react';
import moment from 'moment';
import Editable from 'react-x-editable';
import {render, unmountComponentAtNode} from 'react-dom';
import {ModalFooter, ModalHeader, Modal, Button} from 'reactstrap';
import {validateDate} from '../../../util/Validation';
import t from 'prop-types';

import connect from 'react-redux/es/connect/connect';
import {dashboardService} from '../DashboardService';
import {resultPageUpdate} from '../../../actions/dashboard';

const mapStateToProps = state => {
    return {
        availTabPage: state.dashboard.availTabPage,
    };
};

const mapDispatchToProps = {
    resultPageUpdate
};

class AvailDetails extends React.Component {
    static propTypes = {
        avail: t.object,
        className: t.string,
        abortLabel: t.string,
        reject: t.func,
        resolve: t.func,
        availTabPage: t.object,
        resultPageUpdate: t.func,
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
            errorMessage: ''
        };

        this.emptyValueText = 'Empty field';

        this.toggle = this.toggle.bind(this);
        this.abort = this.abort.bind(this);
        this.confirm = this.confirm.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.validateStartDateFormat = this.validateStartDateFormat.bind(this);
        this.validateEndDateFormat = this.validateEndDateFormat.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.editAvail = this.editAvail.bind(this);
    }

    componentDidMount() {
        if (this.state.avail.vodStart) {
            this.setState({
                avail: {
                    ...this.state.avail,
                    vodStart: moment(this.state.avail.vodStart).format('L'),
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
        return this.props.resolve();
    }

    handleSubmit(editable) {
        this.onEdit(editable);
    }

    editAvail(newAvail) {
        let copiedAvails = this.props.availTabPage.avails.slice();
        let avail = copiedAvails.find(b => b.id === newAvail.id);
        if (avail) {
            for(let availField in newAvail) avail[availField] = newAvail[availField];
        }
        return copiedAvails;
    }

    onEdit(editable) {
        let updatedAvail = {...this.state.avail, [editable.props.title]: editable.value};
        console.log(this.props.availTabPage);
        dashboardService.updateAvails(updatedAvail)
            .then(res => {
                console.log(res);
                let editedAvail = res.data;
                this.setState({
                    avail: editedAvail,
                    errorMessage: ''
                });
                this.props.resultPageUpdate({
                    pages: this.props.availTabPage.pages,
                    avails: this.editAvail(editedAvail),
                    pageSize: this.props.availTabPage.pageSize,
                    total: this.props.availTabPage.total
                });
            })
            .catch(() => {
                editable.setState({availLastEditSucceed: false});
                this.setState({
                    errorMessage: 'Avail edit failed'
                });
                editable.value = this.state.avail[editable.props.title];
                editable.newValue = this.state.avail[editable.props.title];
            });
    }

    validateStartDateFormat(date) {
        if (date) {
            let valid = validateDate(date);
            console.log(valid);
            if (!valid) {
                return 'Incorrect date';
            }
            if (this.state.avail.vodEnd) {
                if (moment(date) > moment(this.state.avail.vodEnd)) {
                    return 'Start date must be before end date';
                }
            }
        }
    }

    validateEndDateFormat(date) {
        if (date) {
            let valid = validateDate(date);
            console.log(valid);
            if (!valid) {
                return 'Incorrect date';
            }
            if (this.state.avail.vodStart) {
                if (moment(date) < moment(this.state.avail.vodStart)) {
                    return 'End date must be before start date';
                }
            }
        }
    }

    validateNotEmpty(data) {
        if (!data) {
            return 'Field can not be empty';
        }
    }

    render() {
        return (
            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} fade={false} backdrop={false}>
                <ModalHeader toggle={this.toggle}>Avail Details</ModalHeader>
                <div className="list-group">
                    <div className="list-group-item list-group-item-action flex-column align-items-start">
                        <div className="row">
                            <div className="col-4">Title:</div>
                            <div className={'col' + (this.state.avail.title ? '' : ' empty')}>
                                <Editable
                                    title="title"
                                    value={this.state.avail.title}
                                    dataType="text"
                                    mode="inline"
                                    emptyValueText={this.emptyValueText}
                                    handleSubmit={this.handleSubmit}
                                    validate={this.validateNotEmpty}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="list-group-item list-group-item-action flex-column align-items-start">
                        <div className="row">
                            <div className="col-4">Studio:</div>
                            <div className={'col' + (this.state.avail.studio ? '' : ' empty')}>
                                <Editable
                                    title="studio"
                                    value={this.state.avail.studio}
                                    dataType="text"
                                    mode="inline"
                                    emptyValueText={this.emptyValueText}
                                    handleSubmit={this.handleSubmit}
                                    validate={this.validateNotEmpty}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="list-group-item list-group-item-action flex-column align-items-start">
                        <div className="row">
                            <div className="col-4">Territory:</div>
                            <div className={'col' + (this.state.avail.territory ? '' : ' empty')}>
                                <Editable
                                    title="territory"
                                    value={this.state.avail.territory}
                                    dataType="text"
                                    mode="inline"
                                    emptyValueText={this.emptyValueText}
                                    handleSubmit={this.handleSubmit}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="list-group-item list-group-item-action flex-column align-items-start">
                        <div className="row">
                            <div className="col-4">Genre:</div>
                            <div className={'col' + (this.state.avail.genre ? '' : ' empty')}>
                                <Editable
                                    title="genre"
                                    value={this.state.avail.genre}
                                    dataType="text"
                                    mode="inline"
                                    emptyValueText={this.emptyValueText}
                                    handleSubmit={this.handleSubmit}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="list-group-item list-group-item-action flex-column align-items-start">
                        <div className="row">
                            <div className="col-4">Vod Start:</div>
                            <div className={'col' + (this.state.avail.vodStart ? '' : ' empty')}>
                                <Editable
                                    title="vodStart"
                                    value={this.state.avail.vodStart}
                                    dataType="text"
                                    mode="inline"
                                    emptyValueText={this.emptyValueText}
                                    handleSubmit={this.handleSubmit}
                                    validate={this.validateStartDateFormat}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="list-group-item list-group-item-action flex-column align-items-start">
                        <div className="row">
                            <div className="col-4">Vod End:</div>
                            <div className={'col' + (this.state.avail.vodEnd ? '' : ' empty')}>
                                <Editable
                                    title="vodEnd"
                                    value={this.state.avail.vodEnd}
                                    dataType="text"
                                    mode="inline"
                                    emptyValueText={this.emptyValueText}
                                    handleSubmit={this.handleSubmit}
                                    validate={this.validateEndDateFormat}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {
                    this.state.errorMessage &&
                    <ModalFooter>
                        <div className="alert alert-danger w-100 m-0" role="alert">
                            {this.state.errorMessage}
                        </div>
                    </ModalFooter>
                }
                <ModalFooter>
                    <Button color="primary" onClick={this.abort}>{this.props.abortLabel}</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

// export default connect(mapStateToProps, mapDispatchToProps)(AvailDetails);

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
        render(<AvailDetails {...props}/>, wrapper);
        const cleanup = function () {
            unmountComponentAtNode(wrapper);
            return setTimeout(function () {
                return wrapper.remove();
            });
        };
    }
};

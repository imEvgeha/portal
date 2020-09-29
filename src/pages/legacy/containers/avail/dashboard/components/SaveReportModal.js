import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {ModalBody, ModalFooter, ModalHeader, Modal, Button} from 'reactstrap';
import PropTypes from 'prop-types';

class CustomModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: true,
        };

        this.toggle = this.toggle.bind(this);
        this.abort = this.abort.bind(this);
        this.confirm = this.confirm.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal,
        });
    }

    abort() {
        return this.props.reject();
    }

    confirm() {
        return this.props.resolve(this.state.reportName);
    }

    _handleKeyPress = e => {
        switch (e.key) {
            case 'Enter':
                this.confirm();
                return;
            case 'Esc':
                this.abort();
                return;
        }
    };

    handleInputChange(event) {
        const value = event.target.value;
        this.setState({reportName: value});
    }

    render() {
        return (
            <Modal isOpen={this.state.modal} toggle={this.toggle} className="nx-stylish" fade={false} backdrop={false}>
                <ModalHeader toggle={this.toggle}>Save report</ModalHeader>
                <ModalBody>
                    <div className="form-group">
                        <label htmlFor="dashboard-avails-report-incorrectValue-text">Report incorrectValue</label>
                        <input
                            type="text"
                            className="form-control"
                            id="dashboard-avails-report-name-text"
                            placeholder="Enter report incorrectValue"
                            value={this.state.reportName}
                            onChange={this.handleInputChange}
                            onKeyPress={this._handleKeyPress}
                        />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.confirm}>
                        Save
                    </Button>{' '}
                    <Button color="secondary" onClick={this.abort}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}
CustomModal.propTypes = {
    reject: PropTypes.func,
    resolve: PropTypes.func,
};
export const saveReportModal = {
    open: (onApprove, onCancel, options) => {
        if (options == null) {
            options = {};
        }
        const props = {
            ...options,
            resolve: reportName => {
                cleanup();
                onApprove(reportName);
            },
            reject: () => {
                cleanup();
                onCancel();
            },
        };
        const wrapper = document.body.appendChild(document.createElement('div'));
        render(<CustomModal {...props} />, wrapper);
        const cleanup = function () {
            unmountComponentAtNode(wrapper);
            return setTimeout(function () {
                return wrapper.remove();
            });
        };
    },
};

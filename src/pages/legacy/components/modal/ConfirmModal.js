import React from 'react';
import {Component} from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {ModalBody, ModalFooter, ModalHeader, Modal} from 'reactstrap';
import {Button} from '@portal/portal-components';
import PropTypes from 'prop-types';

class Confirm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: true,
        };

        this.toggle = this.toggle.bind(this);
        this.abort = this.abort.bind(this);
        this.confirm = this.confirm.bind(this);
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
        return this.props.resolve();
    }

    render() {
        let modalBody;
        if (this.props.description) {
            modalBody = (
                <ModalBody style={this.props.scrollable ? {overflowY: 'scroll', height: 'calc(100vh - 220px)'} : null}>
                    {this.props.description}
                </ModalBody>
            );
        }

        return (
            <Modal
                isOpen={this.state.modal}
                toggle={this.toggle}
                className={this.props.className}
                fade={false}
                backdrop={false}
                keyboard={true}
            >
                <ModalHeader toggle={this.toggle}>{this.props.message}</ModalHeader>
                {modalBody}
                <ModalFooter>
                    <Button label={this.props.confirmLabel} className="p-button-outlined" onClick={this.confirm} />
                    <Button
                        label={this.props.abortLabel}
                        className="p-button-outlined p-button-secondary"
                        onClick={this.abort}
                    />
                </ModalFooter>
            </Modal>
        );
    }
}

export const confirmModal = {
    open: (message, onApprove, onCancel, options) => {
        if (options == null) {
            options = {};
        }
        const props = {
            ...options,
            message: message,
            resolve: () => {
                cleanup();
                onApprove();
            },
            reject: () => {
                cleanup();
                onCancel();
            },
        };
        const wrapper = document.body.appendChild(document.createElement('div'));
        render(<Confirm {...props} />, wrapper);
        const cleanup = function () {
            unmountComponentAtNode(wrapper);
            return setTimeout(function () {
                return wrapper.remove();
            });
        };
    },
};

Confirm.propTypes = {
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    className: PropTypes.string,
    message: PropTypes.string,
    confirmLabel: PropTypes.string,
    abortLabel: PropTypes.string,
    reject: PropTypes.func,
    resolve: PropTypes.func,
    scrollable: PropTypes.bool,
};

Confirm.defaultProps = {
    ...Component.defaultProps,
    confirmLabel: 'Yes',
    abortLabel: 'Cancel',
};

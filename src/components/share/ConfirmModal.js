import React from 'react'
import {Component} from 'react'
import {render, unmountComponentAtNode} from 'react-dom';
import {ModalBody, ModalFooter, ModalHeader, Modal, Button} from "reactstrap";

class Confirm extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            modal: true
        };

        this.toggle = this.toggle.bind(this);
        this.abort = this.abort.bind(this);
        this.confirm = this.confirm.bind(this);
    }

    static defaultProps = {
        ...Component.defaultProps,
        confirmLabel: 'Yes',
        abortLabel: 'Cancel',
    };

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

    render() {
        var modalBody;
        if (this.props.description) {
            modalBody = (
                <ModalBody>{this.props.description}</ModalBody>
            );
        }

        return (
            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} fade={false} backdrop={false}>
                <ModalHeader toggle={this.toggle}>{this.props.message}</ModalHeader>
                {modalBody}
                <ModalFooter>
                    <Button color="primary" onClick={this.confirm}>{this.props.confirmLabel}</Button>{' '}
                    <Button color="secondary" onClick={this.abort}>{this.props.abortLabel}</Button>
                </ModalFooter>
            </Modal>
        );
    }
}


export const confirmModal = {
    open: (message, onApprove, onCancel, options) =>{
        if (options == null) {
            options = {};
        }
        const props = {
            ...options,
            message: message,
            resolve: () => { cleanup();onApprove()},
            reject: () => { cleanup();onCancel()}
        };
        const wrapper = document.body.appendChild(document.createElement('div'));
        render(<Confirm {...props}/>, wrapper);
        const cleanup = function() {
            unmountComponentAtNode(wrapper);
            return setTimeout(function() {
                return wrapper.remove();
            });
        };
    }
};

 export default Confirm;

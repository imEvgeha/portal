import React from 'react';
import {Component} from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {ModalBody, ModalFooter, ModalHeader, Modal, Button} from 'reactstrap';
import t from 'prop-types';

class ErrorModal extends React.Component{

    static propTypes = {
        description: t.string,
        className: t.string,
        message: t.string,
        buttonLabel: t.string,
        accept: t.func
    };

    constructor(props) {
        super(props);
        this.state = {
            modal: true
        };

        this.toggle = this.toggle.bind(this);
        this.accept = this.accept.bind(this);
    }

    static defaultProps = {
        ...Component.defaultProps,
        buttonLabel: 'Ok',
    };

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    accept() {
        return this.props.accept();
    }

    render() {
        let modalBody;
        if (this.props.description) {
            modalBody = (
                <ModalBody style={{wordWrap: 'break-word'}}>{this.props.description}</ModalBody>
            );
        }

        return (
            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} color="danger" backdrop={false}>
                <ModalHeader style={{backgroundColor: '#dc3545'}} toggle={this.toggle}>{this.props.message}</ModalHeader>
                {modalBody}
                <ModalFooter>
                    <Button color="danger" onClick={this.accept}>{this.props.buttonLabel}</Button>
                </ModalFooter>
            </Modal>
        );
    }
}


export const errorModal = {
    open: (message, onApprove, options) =>{
        if (options == null) {
            options = {};
        }
        const props = {
            ...options,
            message: message,
            accept: () => { cleanup();onApprove();}
        };
        const wrapper = document.body.appendChild(document.createElement('div'));
        render(<ErrorModal {...props}/>, wrapper);
        const cleanup = function() {
            unmountComponentAtNode(wrapper);
            return setTimeout(function() {
                return wrapper.remove();
            });
        };
    }
};

export default ErrorModal;

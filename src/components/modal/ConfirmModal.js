import React from 'react';
import {Component} from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {ModalBody, ModalFooter, ModalHeader, Modal, Button} from 'reactstrap';
import t from 'prop-types';

class Confirm extends React.Component{

    static propTypes = {
        description: t.oneOfType([t.string, t.array]),
        className: t.string,
        message: t.string,
        confirmLabel: t.string,
        abortLabel: t.string,
        reject: t.func,
        resolve: t.func,
        scrollable: t.bool
    };

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
        let modalBody;
        if (this.props.description) {
            modalBody = (
                <ModalBody
                    style={this.props.scrollable ? {overflowY:'scroll', height:'calc(100vh - 220px)'} : null}
                >
                    {this.props.description}
                </ModalBody>
            );
        }

        return (
            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} fade={false} backdrop={false} keyboard={true}>
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
            resolve: () => { cleanup();onApprove();},
            reject: () => { cleanup();onCancel();}
        };
        const wrapper = document.body.appendChild(document.createElement('div'));
        render(<Confirm {...props} />, wrapper);
        const cleanup = function() {
            unmountComponentAtNode(wrapper);
            return setTimeout(function() {
                return wrapper.remove();
            });
        };
    }
};

import React from 'react'
import {Component} from 'react'
import {render, unmountComponentAtNode} from 'react-dom';
import {ModalBody, ModalFooter, ModalHeader, Modal, Button} from "reactstrap";

class AvailDetails extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            modal: true,
        };

        this.toggle = this.toggle.bind(this);
        this.abort = this.abort.bind(this);
        this.confirm = this.confirm.bind(this);
    }

    static defaultProps = {
        ...Component.defaultProps,
        confirmLabel: 'Yes',
        abortLabel: 'Close',
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
                <ModalBody>{this.props.description}</ModalBody>
            );
        }

        return (
            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} fade={false} backdrop={false}>
                <ModalHeader toggle={this.toggle}>Avail Details: {this.props.avail.title}</ModalHeader>
                <div className="list-group">
                    <a href="#"
                       className="list-group-item list-group-item-action flex-column align-items-start">
                        <span style={{width: '35%', display: 'inline-block'}}>ID:</span>
                        <span >{this.props.avail.id}</span>
                    </a>
                    <a href="#"
                       className="list-group-item list-group-item-action flex-column align-items-start">
                        <span style={{width: '35%', display: 'inline-block'}}>Title:</span>
                        <span >{this.props.avail.title}</span>
                    </a>
                    <a href="#"
                       className="list-group-item list-group-item-action flex-column align-items-start">
                        <span style={{width: '35%', display: 'inline-block'}}>Studio:</span>
                        <span >{this.props.avail.studio}</span>
                    </a>
                    <a href="#"
                       className="list-group-item list-group-item-action flex-column align-items-start">
                        <span style={{width: '35%', display: 'inline-block'}}>Territory:</span>
                        <span >{this.props.avail.territory}</span>
                    </a>
                    <a href="#"
                       className="list-group-item list-group-item-action flex-column align-items-start">
                        <span style={{width: '35%', display: 'inline-block'}}>Genre:</span>
                        <span >{this.props.avail.genre}</span>
                    </a>
                    <a href="#"
                       className="list-group-item list-group-item-action flex-column align-items-start">
                        <span style={{width: '35%', display: 'inline-block'}}>Avail Start Date:</span>
                        <span >{this.props.avail.availStart}</span>
                    </a>
                    <a href="#"
                       className="list-group-item list-group-item-action flex-column align-items-start">
                        <span style={{width: '35%', display: 'inline-block'}}>Avail End Date:</span>
                        <span >{this.props.avail.availEnd}</span>
                    </a>
                </div>
                <ModalFooter>
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
            resolve: () => { cleanup();onApprove()},
            reject: () => { cleanup();onCancel()}
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

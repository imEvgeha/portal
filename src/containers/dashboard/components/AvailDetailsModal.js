import React from 'react';
import {Component} from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {ModalFooter, ModalHeader, Modal, Button} from 'reactstrap';
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
        };

        this.toggle = this.toggle.bind(this);
        this.abort = this.abort.bind(this);
        this.confirm = this.confirm.bind(this);
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

    render() {

        return (
            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} fade={false} backdrop={false}>
                <ModalHeader toggle={this.toggle}>Avail Details</ModalHeader>
                <div className="list-group">
                    <a href="#"
                        className="list-group-item list-group-item-action flex-column align-items-start">
                        <div className="row">
                            <div className="col-4">ID:</div>
                            <div className="col">{this.props.avail.id}</div>
                        </div>
                    </a>
                    <a href="#"
                        className="list-group-item list-group-item-action flex-column align-items-start">
                        <div className="row">
                            <div className="col-4">Title:</div>
                            <div className="col">{this.props.avail.title}</div>
                        </div>
                    </a>
                    <a href="#"
                        className="list-group-item list-group-item-action flex-column align-items-start">
                        <div className="row">
                            <div className="col-4">Studio:</div>
                            <div className="col">{this.props.avail.studio}</div>
                        </div>
                    </a>
                    <a href="#"
                        className="list-group-item list-group-item-action flex-column align-items-start">
                        <div className="row">
                            <div className="col-4">Territory:</div>
                            <div className="col">{this.props.avail.territory}</div>
                        </div>
                    </a>
                    <a href="#"
                        className="list-group-item list-group-item-action flex-column align-items-start">
                        <div className="row">
                            <div className="col-4">Genre:</div>
                            <div className="col">{this.props.avail.genre}</div>
                        </div>
                    </a>
                    <a href="#"
                        className="list-group-item list-group-item-action flex-column align-items-start">
                        <div className="row">
                            <div className="col-4">Avail Start Date:</div>
                            <div className="col">{this.props.avail.availStart}</div>
                        </div>
                    </a>
                    <a href="#"
                        className="list-group-item list-group-item-action flex-column align-items-start">
                        <div className="row">
                            <div className="col-4">Avail End Date:</div>
                            <div className="col">{this.props.avail.availEnd}</div>
                        </div>
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

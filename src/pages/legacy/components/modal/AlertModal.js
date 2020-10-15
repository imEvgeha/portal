import React from 'react';
import {Component} from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {ModalBody, ModalFooter, ModalHeader, Modal, Button} from 'reactstrap';
import PropTypes from 'prop-types';

class AlertModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: true,
        };

        this.toggle = this.toggle.bind(this);
        this.accept = this.accept.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal,
        });
    }

    accept() {
        return this.props.accept();
    }

    render() {
        let modalBody;
        if (this.props.description) {
            modalBody = <ModalBody style={{wordWrap: 'break-word'}}>{this.props.description}</ModalBody>;
        }

        return (
            <Modal
                isOpen={this.state.modal}
                toggle={this.toggle}
                className={this.props.className}
                fade={false}
                color="dark"
                backdrop={false}
            >
                <ModalHeader style={{backgroundColor: 'primary'}} toggle={this.toggle}>
                    {this.props.message}
                </ModalHeader>
                {modalBody}
                <ModalFooter>
                    <Button color="dark" onClick={this.accept}>
                        {this.props.buttonLabel}
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export const alertModal = {
    open: (message, onApprove, options) => {
        if (options == null) {
            options = {};
        }
        const props = {
            ...options,
            message: message,
            accept: () => {
                cleanup();
                onApprove();
            },
        };
        const wrapper = document.body.appendChild(document.createElement('div'));
        render(<AlertModal {...props} />, wrapper);
        const cleanup = function () {
            unmountComponentAtNode(wrapper);
            return setTimeout(function () {
                return wrapper.remove();
            });
        };
    },
};

AlertModal.propTypes = {
    description: PropTypes.string,
    className: PropTypes.string,
    message: PropTypes.string,
    buttonLabel: PropTypes.string,
    accept: PropTypes.func,
};

AlertModal.defaultProps = {
    ...Component.defaultProps,
    buttonLabel: 'Ok',
};

export default AlertModal;

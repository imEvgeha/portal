import React from 'react';
import {Component} from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {ModalBody, ModalFooter, ModalHeader, Modal, Button} from 'reactstrap';
import PropTypes from 'prop-types';

class ErrorModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: true,
        };

        this.toggle = this.toggle.bind(this);
        this.accept = this.accept.bind(this);
        this.refresh = this.refresh.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal,
        });
    }
    refresh() {
        window.location.reload();
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
                color="danger"
                backdrop={!this.props.closable ? 'static' : false}
            >
                <ModalHeader
                    style={{backgroundColor: '#dc3545'}}
                    toggle={!this.props.closable ? undefined : this.toggle}
                >
                    {this.props.message}
                </ModalHeader>
                {modalBody}
                <ModalFooter>
                    {!this.props.closable ? (
                        <Button color="danger" onClick={this.refresh}>
                            Refresh
                        </Button>
                    ) : (
                        <Button color="danger" onClick={this.accept}>
                            {this.props.buttonLabel}
                        </Button>
                    )}
                </ModalFooter>
            </Modal>
        );
    }
}

export const errorModal = {
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
        render(<ErrorModal {...props} />, wrapper);
        const cleanup = function () {
            unmountComponentAtNode(wrapper);
            return setTimeout(function () {
                return wrapper.remove();
            });
        };
    },
};

ErrorModal.propTypes = {
    description: PropTypes.string,
    className: PropTypes.string,
    message: PropTypes.string,
    buttonLabel: PropTypes.string,
    accept: PropTypes.func,
    closable: PropTypes.bool,
};

ErrorModal.defaultProps = {
    ...Component.defaultProps,
    buttonLabel: 'Ok',
};
export default ErrorModal;

import React from 'react';
import PropTypes from 'prop-types';
import {Button} from 'primereact/button';
import {Dialog} from 'primereact/dialog';
import './TitleDeleteModal.scss';

const TitleDeleteModal = ({onCloseModal, display, header, onDelete, children}) => {
    const handleDelete = () => {
        onDelete();
        onCloseModal();
    };

    const renderFooter = () => (
        <div className="col d-flex justify-content-end align-items-center">
            <div className="d-flex">
                <Button
                    id="titleDeleteBtn"
                    label="Delete"
                    onClick={handleDelete}
                    loadingIcon="pi pi-spin pi-spinner"
                    className="p-button-outlined p-button-secondary"
                    iconPos="right"
                />
                <Button id="titleCancelBtn" label="Cancel" onClick={onCloseModal} className="p-button-outlined" />
            </div>
        </div>
    );

    return (
        <Dialog
            header={header}
            visible={display}
            style={{width: '45vw'}}
            footer={renderFooter()}
            className="nexus-c-title-delete_dialog"
            closeOnEscape={false}
            closable={false}
        >
            {children}
        </Dialog>
    );
};

TitleDeleteModal.propTypes = {
    display: PropTypes.bool.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    onDelete: PropTypes.isRequired,
    children: PropTypes.node.isRequired,
    header: PropTypes.string.isRequired,
};

TitleDeleteModal.defaultProps = {};

export default TitleDeleteModal;

import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'primereact/button';
import './WarningToastWithConfirmation.scss';
import { Col, Row } from 'reactstrap';

const WarningToastWithConfirmation = ({
    title,
    subTitle,
    onOkayButtonClick,
    onCancelButtonClick,
}) => {

    return (
        <div className="flex flex-column nexus-c-bulk-warning-toast-container">
            <Row className="text-center">
                <i className="pi pi-exclamation-triangle nexus-c-bulk-warning-toast-icon" />
                <h4>{title}</h4>
                <p>{subTitle}</p>
            </Row>
            <Row className="grid p-fluid nexus-c-bulk-warning-toast-button-container">
                <Col className="col-6">
                    <Button onClick={onOkayButtonClick} type="button" label="Ok" className="p-button-success" />
                </Col>
                <Col className="col-6">
                    <Button onClick={onCancelButtonClick} type="button" label="Cancel" className="p-button-secondary" />
                </Col>
            </Row>
        </div>
    );
};

WarningToastWithConfirmation.propTypes = {
    title: PropTypes.string,
    subTitle: PropTypes.string,
    onOkayButtonClick: PropTypes.func,
    onCancelButtonClick: PropTypes.func,
};

WarningToastWithConfirmation.defaultProps = {
    title: '',
    subTitle: '',
    onOkayButtonClick: () => null,
    onCancelButtonClick: () => null,
};

export default WarningToastWithConfirmation;

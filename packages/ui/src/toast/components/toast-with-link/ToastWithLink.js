import React from 'react';
import PropTypes from 'prop-types';
import './ToastWithLink.scss';
import { Col, Row } from 'reactstrap';

const ToastWithLink = ({
    title,
    subTitle,
    linkTitle,
    onLinkClick
}) => {
    const handleLinkClick = (e) => {
        e.preventDefault();
        onLinkClick(e);
    }

    return (
        <div className="flex flex-column nexus-c-bulk-success-toast-container">
            <Row>
                <Col className="text-center col-3 nexus-c-bulk-success-icon-container">
                    <i className="pi pi-check pi-fluid nexus-c-bulk-success-toast-icon" />
                </Col>
                <Col className="col-9">
                    <Row>
                        <Col>
                            <h4>{title}</h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p>{subTitle}</p>
                            <a className='nexus-c-bulk-success-toast-link' href='#' onClick={handleLinkClick}>{linkTitle}</a>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
};

ToastWithLink.propTypes = {
    title: PropTypes.string,
    subTitle: PropTypes.string,
    linkTitle: PropTypes.string,
    onLinkClick: PropTypes.func,
};

ToastWithLink.defaultProps = {
    title: '',
    subTitle: '',
    linkTitle: '',
    onLinkClick: () => null,
};

export default ToastWithLink;

import React from 'react';
import PropTypes from 'prop-types';
import './ToastBody.scss';

const ToastBody = ({
    severity,
    summary,
    detail,
    children,
}) => {
    const icons = {success: 'pi-check', warn: 'pi-exclamation-triangle', error: 'pi-times'};
    return (
        <div className="flex flex-column nexus-c-toast__container">
            <div className={`row type-${severity}`}>
                <div className="text-center col-3 nexus-c-toast__icon-container">
                    <i className={`pi ${icons[severity]} pi-fluid nexus-c-toast__icon`} />
                </div>
                <div className="col-9">
                    <div className='row'>
                        <h4>{summary}</h4>
                    </div>
                    <div className='row'>
                        <p>{detail}</p>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

ToastBody.propTypes = {
    severity: PropTypes.string,
    summary: PropTypes.string,
    detail: PropTypes.string,
};

ToastBody.defaultProps = {
    severity: 'success',
    summary: '',
    detail: '',
};

export default ToastBody;

import React from 'react';
import PropTypes from 'prop-types';
import './ToastBody.scss';

const ToastBody = ({
    severity,
    title,
    subTitle,
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
                        <h4>{title}</h4>
                    </div>
                    <div className='row'>
                        <p>{subTitle}</p>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

ToastBody.propTypes = {
    severity: PropTypes.string,
    title: PropTypes.string,
    subTitle: PropTypes.string,
};

ToastBody.defaultProps = {
    severity: 'success',
    title: '',
    subTitle: '',
};

export default ToastBody;

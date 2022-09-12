import React from 'react';
import PropTypes from 'prop-types';
import {Button} from '@portal/portal-components';
import {Badge} from 'primereact/badge';

const NexusStatusDot = ({onAction, label, severity, isDisabled, isLoading}) => {
    return (
        <div className="nexus-c-status-dot">
            <div className="row align-items-center">
                {/* if there is label, make it col-3, if its missing name/label, make it col-12 */}
                <div className={`${label ? 'col-3 px-0' : 'col-12'} text-center`}>
                    <Badge severity={severity} />
                </div>

                {!!label && (
                    <div className={`col-9 ${onAction ? 'px-0' : ''}`}>
                        {/* if label is true and onAction is false render label */}
                        {!onAction && <span>{label}</span>}
                        {/* if label is true and onAction is true render Button */}
                        {onAction && (
                            <Button
                                className="p-button-text"
                                label={label}
                                onClick={onAction}
                                disabled={isDisabled}
                                loading={isLoading}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

NexusStatusDot.propTypes = {
    isDisabled: PropTypes.bool,
    onAction: PropTypes.func,
    label: PropTypes.string,
    severity: PropTypes.string,
    isLoading: PropTypes.bool,
};

NexusStatusDot.defaultProps = {
    isDisabled: false,
    onAction: null,
    label: '',
    severity: '',
    isLoading: false,
};

export default NexusStatusDot;

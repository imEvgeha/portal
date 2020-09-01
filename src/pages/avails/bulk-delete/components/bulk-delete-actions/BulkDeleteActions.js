import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {BULK_DELETE_CONTINUE_MSG, BULK_DELETE_BTN_DELETE, BULK_DELETE_BTN_CANCEL} from '../../constants';
import './BulkDeleteActions.scss';

const BulkDeleteActions = ({onClose, onSubmit}) => {
    return (
        <div className="nexus-c-bulk-delete-actions__wrapper">
            <div className="nexus-c-bulk-delete-actions__continue">{BULK_DELETE_CONTINUE_MSG}</div>
            <div className="nexus-c-bulk-delete-actions__btn-wrapper">
                <Button
                    appearance="subtle"
                    onClick={onClose}
                    className="nexus-c-bulk-delete-actions__cancel-btn"
                    isDisabled={false}
                >
                    {BULK_DELETE_BTN_CANCEL}
                </Button>
                <Button
                    appearance="primary"
                    onClick={onSubmit}
                    className="nexus-c-bulk-delete-actions__delete-btn"
                    isDisabled={false}
                >
                    {BULK_DELETE_BTN_DELETE}
                </Button>
            </div>
        </div>
    );
};

BulkDeleteActions.propTypes = {
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
};

BulkDeleteActions.defaultProps = {
    onClose: () => null,
    onSubmit: () => null,
};

export default BulkDeleteActions;

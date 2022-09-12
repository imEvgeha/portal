import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {Button} from '@portal/portal-components';
import NexusStatusDot from '../../../nexus-status-dot/NexusStatusDot';
import {DOT_TYPES} from '../constants';

const ButtonsBuilder = ({
    dirty,
    reset,
    errors,
    disableSubmit,
    isSaving,
    canEdit,
    isEmpty,
    onCancel,
    seasonPersons,
    showValidationError,
}) => {
    const formStatus = (dirty, errors) => {
        if (errors > 0) return DOT_TYPES.ERROR;
        if (dirty || !isEmpty(seasonPersons)) return DOT_TYPES.UPDATED;
        return DOT_TYPES.SUCCESS;
    };

    useEffect(() => {
        setTimeout(() => {
            reset();
        }, 0);
    }, []);

    return (
        <>
            <div className="nexus-c-dynamic-form__actions-container">
                <Button
                    className="p-button-outlined nexus-c-dynamic-form__discard-button"
                    onClick={() => onCancel()}
                    disabled={((!dirty && disableSubmit) || isSaving || !canEdit) && isEmpty(seasonPersons)}
                    label="Discard"
                />

                <div className="nexus-c-dynamic-form__status">
                    <NexusStatusDot severity={formStatus(dirty || !disableSubmit, errors)} />
                </div>

                <Button
                    type="submit"
                    className="p-button-outlined nexus-c-dynamic-form__submit-button"
                    disabled={((!dirty && disableSubmit) || !canEdit) && isEmpty(seasonPersons)}
                    // this is a form submit button and hence validation check will not work on submit function
                    onClick={showValidationError}
                    loading={isSaving}
                    label="Save"
                />
            </div>
        </>
    );
};

ButtonsBuilder.propTypes = {
    dirty: PropTypes.bool,
    reset: PropTypes.func,
    errors: PropTypes.any,
    disableSubmit: PropTypes.bool,
    canEdit: PropTypes.bool,
    isSaving: PropTypes.bool,
    isEmpty: PropTypes.func,
    onCancel: PropTypes.func,
    seasonPersons: PropTypes.any,
    showValidationError: PropTypes.func,
};

ButtonsBuilder.defaultProps = {
    dirty: false,
    reset: () => null,
    errors: null,
    disableSubmit: true,
    canEdit: false,
    isSaving: false,
    isEmpty: () => null,
    onCancel: () => null,
    seasonPersons: null,
    showValidationError: () => null,
};

export default ButtonsBuilder;

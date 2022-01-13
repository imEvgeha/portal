import React, { useEffect } from 'react'
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {default as ErrorMessage} from '@atlaskit/form';
import NexusStatusDot from '../../../../../lib/elements/nexus-status-dot/NexusStatusDot';

const ButtonsBuilder = ({dirty, reset, errors, disableSubmit, isSaving, canEdit, isEmpty, onCancel, seasonPersons, setValidationErrorCount}) => {
  const formStatus = (dirty, errors) => {
    if (errors > 0) return 'error';
    if (dirty || !isEmpty(seasonPersons)) return 'updated';
    return 'success';
  };

  const showValidationError = () => {
    const errorsCount = document.getElementsByClassName('nexus-c-field__error').length;
    errorsCount && setValidationErrorCount(errorsCount);
  };

  useEffect(() => {
    setTimeout(() => {
      reset();
    }, 0)
  }, [])

  return (
    <>
        {errors > 0 && (
            <div className="nexus-c-dynamic-form__validation-msg">
                <ErrorMessage>
                    {errors} {errors === 1 ? 'error' : 'errors'} on page
                </ErrorMessage>
            </div>
        )}
        <div className="nexus-c-dynamic-form__actions-container">
            <Button
                className="nexus-c-dynamic-form__discard-button"
                onClick={() => onCancel()}
                isDisabled={((!dirty && disableSubmit) || isSaving || !canEdit) && isEmpty(seasonPersons)}
            >
                Discard
            </Button>
            <div className="nexus-c-dynamic-form__status">
                <NexusStatusDot severity={formStatus(dirty || !disableSubmit, errors)} />
            </div>
            <Button
                type="submit"
                className="nexus-c-dynamic-form__submit-button"
                isDisabled={((!dirty && disableSubmit) || !canEdit) && isEmpty(seasonPersons)}
                // this is a form submit button and hence validation check will not work on submit function
                onClick={showValidationError}
                isLoading={isSaving}
            >
                Save
            </Button>
        </div>
    </>
  )
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
  setValidationErrorCount: PropTypes.func,
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
  setValidationErrorCount: () => null,
};

export default ButtonsBuilder;
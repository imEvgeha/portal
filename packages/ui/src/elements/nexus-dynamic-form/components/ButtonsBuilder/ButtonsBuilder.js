import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {default as ErrorMessage} from '@atlaskit/form';
import NexusStatusDot from '../../../nexus-status-dot/NexusStatusDot';
import { DOT_TYPES } from '../constants';

const ButtonsBuilder = ({dirty, reset, disableSubmit, isSaving, canEdit, isEmpty, onCancel, seasonPersons}) => {
  const [validationErrorCount, setValidationErrorCount] = useState(0);

  const formStatus = (dirty, validationErrorCount) => {
    if (validationErrorCount > 0) return DOT_TYPES.ERROR;
    if (dirty || !isEmpty(seasonPersons)) return DOT_TYPES.UPDATED;
    return DOT_TYPES.SUCCESS;
  };

  useEffect(() => {
        // eslint-disable-next-line prefer-destructuring
        const firstErrorElement = document.getElementsByClassName('nexus-c-field__error')[0];
        if (firstErrorElement) firstErrorElement.scrollIntoView(false);
    }, [validationErrorCount]);

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
        {validationErrorCount > 0 && (
            <div className="nexus-c-dynamic-form__validation-msg">
                <ErrorMessage>
                    {validationErrorCount} {validationErrorCount === 1 ? 'error' : 'errors'} on page
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
                <NexusStatusDot severity={formStatus(dirty || !disableSubmit, validationErrorCount)} />
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
  disableSubmit: PropTypes.bool,
  canEdit: PropTypes.bool,
  isSaving: PropTypes.bool,
  isEmpty: PropTypes.func,
  onCancel: PropTypes.func,
  seasonPersons: PropTypes.any,
};

ButtonsBuilder.defaultProps = {
  dirty: false,
  reset: () => null,
  disableSubmit: true,
  canEdit: false,
  isSaving: false,
  isEmpty: () => null,
  onCancel: () => null,
  seasonPersons: null,
};

export default ButtonsBuilder;
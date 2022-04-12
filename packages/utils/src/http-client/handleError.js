/* eslint-disable no-magic-numbers */
import React from 'react';
import {addToast, removeToast} from '@vubiquity-nexus/portal-ui/lib/toast/NexusToastNotificationActions';
import ToastBody from '@vubiquity-nexus/portal-ui/lib/toast/components/toast-body/ToastBody';
import {ERROR_TITLE} from '@vubiquity-nexus/portal-ui/lib/toast/constants';
import {Button} from 'primereact/button';
import {store} from '../../../../src';
import {errorModal} from '../../../../src/pages/legacy/components/modal/ErrorModal';

/*
    Passing errorToasts in param:
    errorToast for all status codes:
    errorToast: {title: '', description: ''}

    can pass errorToast for specific error code as follows:
    errorCodesToast: [{status: 404, title: '', description: ''}, {status: 500, title: '', description: ''}]
    default error title, icon and autoDismiss are already added

    can pass successToast if needed to show toast on success of a API call
    default success title, icon and autoDismiss are already added
    (if successToast is passed then only these are displayed)

    remove toast after 4 seconds
*/

const showErrorModal = error => {
    const {status, config: {url = '', method = ''} = {}} = error || {};
    const ACCESS_DENIED = {
        codes: [401, 403, 451, 511],
        title: 'Access denied',
    };

    if (ACCESS_DENIED.codes.includes(status)) {
        const description = `Status: ${status},\nURI: ${url},\nMethod: ${method.toUpperCase()}`;
        errorModal.open(ACCESS_DENIED.title, () => null, {description, status});
        return true;
    }
};

export const showToastForErrors = (error, {errorToast = null, errorCodesToast = []}) => {
    let {status, data = {}, message, description} = error || {};
    if (typeof error === 'string') message = error;

    const errorMessage = 'Unexpected error occurred. Please try again later';
    const ERROR_MODAL = {
        codes: [503],
        title: errorMessage,
    };
    const defaultErrorToast = {
        severity: 'error',
    };

    let toast = null;
    const [err] = errorCodesToast.filter(error => error.status === status);

    if (err) {
        toast = {
            ...defaultErrorToast,
            ...err,
            description: err.description || data.message || message || errorMessage,
        };
    } else {
        toast = errorToast
            ? {
                  ...defaultErrorToast,
                  ...errorToast,
              }
            : {
                  severity: 'error',
                  content: (
                      <ToastBody
                          summary={ERROR_TITLE}
                          detail={description || message || data.message || JSON.stringify(data) || errorMessage}
                          severity="error"
                      >
                          {ERROR_MODAL.codes.includes(status) ? (
                              <Button
                                  label="Ok"
                                  className="p-button-link p-toast-button-link"
                                  onClick={() => store.dispatch(removeToast())}
                              />
                          ) : null}
                      </ToastBody>
                  ),
              };
    }
    store.dispatch(addToast(toast));
};

const handleError = (error, options = {isWithErrorHandling: true}) => {
    const {status, statusText, name, errorMessage} = error || {};

    // TODO: this should be removed from http client error handling
    // it considers UI level (modal and toast) and should be called inside ui|redux actions|redux sagas
    if (status) {
        const isModalOpened = showErrorModal(errorMessage);

        const errorOptions = {
            isWithErrorHandling: true,
            ...options,
        };

        if (errorOptions.isWithErrorHandling && !isModalOpened) {
            showToastForErrors(errorMessage, errorOptions);
        }
    }

    return {
        status,
        statusText,
        type: name,
        message: errorMessage,
    };
};

export default handleError;

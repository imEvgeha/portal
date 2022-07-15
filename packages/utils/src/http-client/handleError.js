/* eslint-disable no-magic-numbers */
import React from 'react';
import {addToast, removeToast} from '@vubiquity-nexus/portal-ui/lib/toast/NexusToastNotificationActions';
import ToastBody from '@vubiquity-nexus/portal-ui/lib/toast/components/toast-body/ToastBody';
import {ERROR_TITLE} from '@vubiquity-nexus/portal-ui/lib/toast/constants';
import {isEmpty} from 'lodash';
import {Button} from 'primereact/button';
import {store} from '../../../../src';

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

const appendCustomMsg = (errorMessage, customMessage) =>
    customMessage ? `${customMessage} Details: ${errorMessage}` : errorMessage;

export const showToastForErrors = (errorObj, {errorToast = null, errorCodesToast = [], errorMessage}) => {
    const {error, description, message} = errorObj;

    const fallbackErrorMessage = 'Unexpected error occurred. Please try again later';

    const TOAST_ACTIONS = {
        codes: [503],
        title: fallbackErrorMessage,
    };

    let toast = null;
    const [err] = errorCodesToast.filter(error => error?.status === error?.code);
    const errorDetail =
        description || err?.description || error?.message || message || 'Unknown error. Please try again.';

    if (err) {
        toast = {
            severity: 'error',
            ...err,
            description: appendCustomMsg(err.description || error.message, errorMessage),
        };
    } else {
        toast = {
            severity: 'error',
            ...(errorToast || {
                content: (
                    <ToastBody
                        summary={ERROR_TITLE}
                        detail={appendCustomMsg(errorDetail, errorMessage)}
                        severity="error"
                    >
                        {TOAST_ACTIONS.codes.includes(error?.status) ? (
                            <Button
                                label="Ok"
                                className="p-button-link p-toast-button-link"
                                onClick={() => store.dispatch(removeToast())}
                            />
                        ) : null}
                    </ToastBody>
                ),
            }),
        };
    }
    store.dispatch(addToast(toast));
};

const handleError = (error, options = {isWithErrorHandling: true}) => {
    const isErrorValid = !(isEmpty(error) || (error?.request && isEmpty(error?.request)));
    const defaultError = {
        status: 'Default Error',
        errorMessage: {
            bindingResult: 'Default Error',
            description: 'Unknown error. Please try again.',
        },
    };
    const {status, statusText, name, errorMessage} = isErrorValid ? error : defaultError;

    // TODO: this should be removed from http client error handling
    // it considers UI level (modal and toast) and should be called inside ui|redux actions|redux sagas
    if (status) {
        const errorOptions = {
            isWithErrorHandling: true,
            ...options,
        };

        if (errorOptions.isWithErrorHandling) {
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

/* eslint-disable no-magic-numbers */
import React from 'react';
import {Button} from '@portal/portal-components';
import {addToast, removeToast} from '@vubiquity-nexus/portal-ui/lib/toast/NexusToastNotificationActions';
import {isEmpty} from 'lodash';
import {store} from '../../../../src';

const defaultErrors = [
    {
        errorCodes: [503],
        message: 'Unexpected error occurred. Please try again later',
        toastAction: {
            label: 'Ok',
            className: 'p-button-link p-toast-button-link',
            onClick: () => store.dispatch(removeToast()),
        },
    },
];

const appendCustomMsg = (errorMessage, customMessage) =>
    customMessage ? `${customMessage} Details: ${errorMessage}` : errorMessage;

const apiErrorToast = (error, {errorMessage: customErrorMessage, customErrors}) => {
    const {errorMessage, status} = error;
    let {description = '', message = ''} = errorMessage || {};

    description ||= message;
    let toastAction;

    const customError =
        defaultErrors?.find(entry => entry.errorCodes.includes(status)) ||
        customErrors?.find(entry => entry.errorCodes === 'all' || entry.errorCodes.includes(status));

    if (customError) {
        description = customError.message;
        toastAction = customError.toastAction;
    } else if (customErrorMessage) {
        description = appendCustomMsg(description, customErrorMessage);
    }

    const toast = {
        severity: 'error',
        detail: description,
        content: () => !!toastAction && <Button {...toastAction} />,
    };

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
            apiErrorToast(isErrorValid ? error : defaultError, errorOptions);
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

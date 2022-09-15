import React, {useEffect, useRef} from 'react';
import {Toast} from '@portal/portal-components';
import {useSelector} from 'react-redux';
import ToastBody from './components/toast-body/ToastBody';
import {MAX_ERROR_DETAILS_CHARS} from './constants';

const NexusToastNotification = () => {
    const toastRef = useRef(null);
    const toasts = useSelector(state => state.ui.toast.toast);

    const getContentForToast = elem => {
        if (elem) {
            const {summary, detail, severity} = getUpdatedToast(elem);
            return (
                <ToastBody summary={summary} detail={detail} severity={severity}>
                    {elem.content?.()}
                </ToastBody>
            );
        }
        return null;
    };

    const getUpdatedToast = elem => {
        if (elem && elem.severity === 'error') {
            return {
                ...elem,
                detail:
                    elem.detail?.length > MAX_ERROR_DETAILS_CHARS
                        ? `${elem.detail?.substring(0, MAX_ERROR_DETAILS_CHARS)}...`
                        : elem.detail,
                summary: 'Error',
                sticky: true,
            };
        } else if (elem && elem.severity === 'success') {
            return {
                ...elem,
                summary: 'Success',
                life: 6000,
            };
        } else if (elem && elem.severity === 'warn') {
            return {
                ...elem,
                summary: 'Warning',
                sticky: true,
            };
        }

        return elem;
    };

    const showToast = async (toasts, toastRef) => {
        if (toastRef?.current && toasts?.length) {
            const toastsToShow = toasts.map(e => ({
                ...getUpdatedToast(e),
                content: e?.content ? getContentForToast(e) : undefined,
            }));
            toastRef.current.show(toastsToShow);
        }
    };

    useEffect(() => {
        showToast(toasts, toastRef);
    }, [toasts]);

    return <Toast ref={toastRef} />;
};

export default NexusToastNotification;

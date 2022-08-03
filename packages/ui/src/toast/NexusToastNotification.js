import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {Toast} from '@portal/portal-components';
import {useDispatch} from 'react-redux';
import {removeToast} from './NexusToastNotificationActions';
import ToastBody from './components/toast-body/ToastBody';
import withToasts from './hoc/withToasts';

const NexusToastNotification = ({toasts}) => {
    const toastRef = useRef(null);
    const dispatch = useDispatch();

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
        await toastRef.current.clear();
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

    return (
        <Toast
            ref={toastRef}
            onRemove={e => {
                const toastIndex = toasts?.findIndex(t => t?.detail === e?.detail);
                if (toasts?.[toastIndex]) {
                    toasts[toastIndex]?.onRemoveFn?.();
                    dispatch(removeToast(toasts?.findIndex(t => t?.detail === e?.detail)));
                }
            }}
        />
    );
};

NexusToastNotification.propTypes = {
    toasts: PropTypes.array,
};

NexusToastNotification.defaultProps = {
    toasts: [],
};

export default withToasts(NexusToastNotification);

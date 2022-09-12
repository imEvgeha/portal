import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Button} from '@portal/portal-components';
import {Dialog} from 'primereact/dialog';

const NexusConfirmationDialog = ({visible, message, header, rejectLabel, acceptLabel, accept, reject}) => {
    const [isVisible, setIsVisible] = useState(visible);

    const onHideDialog = () => {
        setIsVisible(false);
        if (reject) {
            setTimeout(() => reject(), 200);
        }
    };

    const onAccept = () => {
        setIsVisible(false);
        if (accept) {
            setTimeout(() => accept(), 200);
        }
    };

    const footer = () => {
        return (
            <div className="row">
                <div className="col-12 text-end">
                    <Button
                        className="p-button-outlined p-button-secondary"
                        label={rejectLabel}
                        onClick={onHideDialog}
                    />
                    <Button className="p-button-outlined" label={acceptLabel} onClick={onAccept} />
                </div>
            </div>
        );
    };

    return (
        <Dialog
            key="dlgConfirmationModal"
            visible={isVisible}
            onHide={onHideDialog}
            breakpoints={{'960px': '75vw', '640px': '100vw'}}
            style={{width: '30vw'}}
            footer={footer}
            closeOnEscape={false}
            header={header}
            closable={false}
        >
            <div className="p-dialog-subheader">{!!message && message}</div>
        </Dialog>
    );
};

NexusConfirmationDialog.propTypes = {
    visible: PropTypes.bool.isRequired,
    message: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    rejectLabel: PropTypes.string,
    acceptLabel: PropTypes.string,
    header: PropTypes.string,
    accept: PropTypes.func,
    reject: PropTypes.func,
};

NexusConfirmationDialog.defaultProps = {
    message: '',
    header: 'Please Confirm',
    rejectLabel: 'Reject',
    acceptLabel: 'Accept',
    accept: undefined,
    reject: undefined,
};

export default NexusConfirmationDialog;

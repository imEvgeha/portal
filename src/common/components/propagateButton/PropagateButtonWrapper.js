import React, {useCallback, useContext} from 'react';
import PropTypes from 'prop-types';
import {PROPAGATE_TITLE} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-dynamic-form/constants';
import {NexusModalContext} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-modal/NexusModal';
import PropagateButton from '@vubiquity-nexus/portal-ui/lib/elements/nexus-person/elements/PropagateButton/PropagateButton';
import PropagateForm from '@vubiquity-nexus/portal-ui/src/elements/nexus-propagate-form/PropagateForm';
import './PropagateButtonWrapper.scss';

const PropagateButtonWrapper = ({canEdit, onClose, getValues, setFieldValue, person}) => {
    const {openModal, closeModal} = useContext(NexusModalContext);

    const closePropagateModal = () => {
        closeModal();
        onClose(prev => !prev);
    };

    const showPropagateModal = useCallback((getValues, setFieldValue) => {
        openModal(
            <PropagateForm
                getValues={getValues}
                setFieldValue={setFieldValue}
                onClose={closePropagateModal}
                person={person}
            />,
            {
                title: PROPAGATE_TITLE,
                width: 'small',
            }
        );
    }, []);

    return (
        canEdit && (
            <div className="nexus-c-dynamic-form__additional-option">
                <PropagateButton onClick={() => showPropagateModal(getValues, setFieldValue)} />
            </div>
        )
    );
};

PropagateButtonWrapper.propTypes = {
    canEdit: PropTypes.bool,
    onClose: PropTypes.func,
    getValues: PropTypes.func,
    setFieldValue: PropTypes.func,
    person: PropTypes.object,
};

PropagateButtonWrapper.defaultProps = {
    canEdit: false,
    onClose: () => null,
    getValues: () => null,
    setFieldValue: () => null,
    person: {},
};

export default PropagateButtonWrapper;

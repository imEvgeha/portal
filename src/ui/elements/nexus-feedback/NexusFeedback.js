import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import Select from '@atlaskit/select';
import TextArea from '@atlaskit/textarea';
import {SUCCESS_ICON, SUCCESS_TITLE} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-toast-notification/constants';
import withToasts from '../../toast/hoc/withToasts';
import './NexusFeedback.scss';
import {options, THANKYOU_NOTE} from './constants';

const NexusFeedback = ({addToast, currentPage, closeModal}) => {
    const [feedback, setFeedback] = useState('');
    const [selected, setSelected] = useState('');

    const handleSelectChange = value => {
        setSelected(value);
    };

    const handleSubmit = () => {
        // TODO: send info to backend email service
        // console.log(selected, feedBack, currentPage);
        // call API and then close modal
        closeModal();
        addToast({
            title: SUCCESS_TITLE,
            description: THANKYOU_NOTE,
            icon: SUCCESS_ICON,
            isAutoDismiss: true,
            isWithOverlay: false,
        });
    };

    return (
        <div>
            <div className="nexus-c-feedback__select">
                <Select
                    options={options}
                    placeholder="Select one option"
                    onChange={handleSelectChange}
                    value={selected}
                    defaultValue={selected}
                />
            </div>
            <div className="nexus-c-feedback__textarea">
                <TextArea
                    appearance="standard"
                    onChange={e => setFeedback(e.target.value)}
                    minimumRows={5}
                    value={feedback}
                    isDisabled={!selected}
                />
            </div>
            <div className="nexus-c-feedback__btn-wrapper">
                <Button
                    appearance="primary"
                    onClick={handleSubmit}
                    className="nexus-c-feedback__button"
                    isDisabled={!feedback}
                >
                    Send Feedback
                </Button>
                <Button
                    appearance="subtle"
                    onClick={closeModal}
                    className="nexus-c-feedback__button"
                    isDisabled={false}
                >
                    Cancel
                </Button>
            </div>
        </div>
    );
};

NexusFeedback.propTypes = {
    addToast: PropTypes.func,
    closeModal: PropTypes.func.isRequired,
    currentPage: PropTypes.string,
};

NexusFeedback.defaultProps = {
    addToast: () => null,
    currentPage: '',
};

export default withToasts(NexusFeedback);

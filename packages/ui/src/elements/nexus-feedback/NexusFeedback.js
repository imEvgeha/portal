import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import Select from '@atlaskit/select';
import TextArea from '@atlaskit/textarea';
import {addToast} from '@vubiquity-nexus/portal-ui/lib/toast/NexusToastNotificationActions';
import {useDispatch} from 'react-redux';
import {options, THANKYOU_NOTE} from './constants';
import './NexusFeedback.scss';

const NexusFeedback = ({currentPage, closeModal}) => {
    const dispatch = useDispatch();
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
        dispatch(
            addToast({
                detail: THANKYOU_NOTE,
                severity: 'success',
            })
        );
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
    closeModal: PropTypes.func,
    currentPage: PropTypes.string,
};

NexusFeedback.defaultProps = {
    closeModal: () => null,
    currentPage: '',
};

export default NexusFeedback;

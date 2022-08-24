import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import TextArea from '@atlaskit/textarea';
import {Dropdown} from '@portal/portal-components';
import withToasts from '../../toast/hoc/withToasts';
import {options, THANKYOU_NOTE} from './constants';
import './NexusFeedback.scss';

const NexusFeedback = ({addToast, currentPage, closeModal}) => {
    const [feedback, setFeedback] = useState('');
    const [selected, setSelected] = useState('');

    const handleSelectChange = e => {
        setSelected(e.value);
    };

    const handleSubmit = () => {
        // TODO: send info to backend email service
        // console.log(selected, feedBack, currentPage);
        // call API and then close modal
        closeModal();
        addToast({
            detail: THANKYOU_NOTE,
            severity: 'success',
        });
    };

    return (
        <div>
            <div className="nexus-c-feedback__select">
                <Dropdown
                    id="ddlFeedbackOptions"
                    labelProps={{
                        label: 'Option',
                        stacked: true,
                        shouldUpper: false,
                    }}
                    value={selected}
                    columnClass="col-12"
                    options={options}
                    placeholder="Select one option"
                    onChange={handleSelectChange}
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
    closeModal: PropTypes.func,
    currentPage: PropTypes.string,
};

NexusFeedback.defaultProps = {
    addToast: () => null,
    closeModal: () => null,
    currentPage: '',
};

export default withToasts(NexusFeedback);

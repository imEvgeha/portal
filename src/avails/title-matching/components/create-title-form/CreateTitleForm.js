import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Form} from 'react-forms-processor';
import {renderer} from 'react-forms-processor-atlaskit';
import {ErrorMessage} from '@atlaskit/form';
import Button from '@atlaskit/button/dist/cjs/components/Button';
import {titleService} from '../../../../containers/metadata/service/TitleService';
import constants from './CreateTitleFormConstants';

const {
    NEW_TITLE_FORM_SCHEMA,
    NEW_TITLE_LABEL_CANCEL,
    NEW_TITLE_LABEL_SUBMIT,
    // NEW_TITLE_ERROR_EMPTY_FIELDS,
    // NEW_TITLE_ERROR_ALREADY_EXISTS,
} = constants;

const CreateTitleForm = ({close}) => {
    const [error, setError] = useState();
    const [titleValue, setTitleValue] = useState({
        title: '',
        contentType: '',
        seriesTitleName: '',
        seasonNumber: '',
        episodeNumber: '',
        releaseYear: '',
    });
    // const {addToast} = useContext();

    const submitTitle = (title) => {
        titleService.createTitle(title).then(() => {
            // TODO: Send out a flash message (NexusToastNotification)
            close();
        }).catch(() => {
            // TODO: Error handling
            setError('Error');
        });
    };

    return (
        <div className="nexus-c-create-title-form">
            <Form
                renderer={renderer}
                defaultFields={NEW_TITLE_FORM_SCHEMA}
                value={titleValue}
                onChange={(value, isFilled) => setTitleValue({...value, isFilled})}
            />
            {error &&
                <ErrorMessage>
                    {error}
                </ErrorMessage>
            }
            <div className="nexus-c-create-title-form__action-buttons">
                <Button onClick={close}>
                    {NEW_TITLE_LABEL_CANCEL}
                </Button>
                <Button
                    onClick={() => submitTitle(titleValue)}
                    isDisabled={!titleValue.isFilled}
                    appearance="primary"
                >
                    {NEW_TITLE_LABEL_SUBMIT}
                </Button>
            </div>
        </div>
    );
};

CreateTitleForm.propTypes = {
    close: PropTypes.func.isRequired,
};

export default CreateTitleForm;

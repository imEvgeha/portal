import React, {useContext, useState} from 'react';
import PropTypes from 'prop-types';
import {Form} from 'react-forms-processor';
import {renderer} from 'react-forms-processor-atlaskit';
import {ErrorMessage} from '@atlaskit/form';
import Button from '@atlaskit/button';
import {titleService} from '../../../../containers/metadata/service/TitleService';
import NexusToastNotificationContext from '../../../../ui-elements/nexus-toast-notification/NexusToastNotificationContext';
import {getDomainName} from '../../../../util/Common';
import {SUCCESS_ICON, SUCCESS_TITLE} from '../../../../ui-elements/nexus-toast-notification/constants';
import constants from './CreateTitleFormConstants';
import './CreateTitleForm.scss';

const {
    NEW_TITLE_FORM_SCHEMA,
    NEW_TITLE_LABEL_CANCEL,
    NEW_TITLE_LABEL_SUBMIT,
    NEW_TITLE_TOAST_SUCCESS_MESSAGE,
    // NEW_TITLE_ERROR_EMPTY_FIELDS,
    // NEW_TITLE_ERROR_ALREADY_EXISTS,
} = constants;

const CreateTitleForm = ({close}) => {
    // eslint-disable-next-line no-unused-vars
    const [error, setError] = useState();
    const [titleValue, setTitleValue] = useState({
        title: '',
        contentType: '',
        seriesTitleName: '',
        seasonNumber: '',
        episodeNumber: '',
        releaseYear: '',
    });
    const {addToast} = useContext(NexusToastNotificationContext);

    const submitTitle = (title) => {
        // Delete empty properties before sending
        Object.keys(title).forEach(propKey => title[propKey] || delete title[propKey]);
        // Delete helper property
        delete title.isFilled;

        titleService.createTitle(title).then(res => {
            const url = `${getDomainName()}/metadata/detail/${res.data.id}`;
            const onViewTitleClick = () => window.open(url, '_blank');
            addToast({
                title: SUCCESS_TITLE,
                description: NEW_TITLE_TOAST_SUCCESS_MESSAGE,
                icon: SUCCESS_ICON,
                actions: [
                    {
                        content: 'View title',
                        onClick: onViewTitleClick,
                    }
                ]
            });
            close();
        }).catch(() => {
            // TODO: Error handling
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

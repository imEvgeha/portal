import React from 'react';
import {Form} from 'react-forms-processor';
import {renderer} from 'react-forms-processor-atlaskit';
import {ErrorMessage} from '@atlaskit/form';
import Button from '@atlaskit/button/dist/cjs/components/Button';
import {titleService} from '../../../containers/metadata/service/TitleService';
import {ADVERTISEMENT, EPISODE, EVENT, MOVIE, SEASON, SERIES, SPORTS} from '../../../constants/metadata/contentType';

// TODO: Move to titleMatchingConstants.js
const NEW_TITLE_MODAL_TITLE = 'Create New Title';
const NEW_TITLE_LABEL_CANCEL = 'Cancel';
const NEW_TITLE_LABEL_SUBMIT = 'Match & Create';
const NEW_TITLE_ERROR_ALREADY_EXISTS = 'WARNING! Title already exists. Please select existing title or edit title details.';
const NEW_TITLE_ERROR_EMPTY_FIELDS = 'WARNING! Please add all required fields.';
const newTitleFormSchema = [
    {
        name: 'title',
        id: 'title',
        label: 'Title',
        type: 'text',
        shouldFitContainer: true,
        placeholder: 'add title',
        required: true,
    },
    {
        name: 'contentType',
        id: 'contentType',
        label: 'Content Type',
        type: 'select',
        shouldFitContainer: true,
        placeholder: 'Select content type',
        required: true,
        options: [
            {
                items: [
                    {label: MOVIE.name, value: MOVIE.apiName},
                    {label: SERIES.name, value: SERIES.apiName},
                    {label: SEASON.name, value: SEASON.apiName},
                    {label: EPISODE.name, value: EPISODE.apiName},
                    {label: EVENT.name, value: EVENT.apiName},
                    {label: SPORTS.name, value: SPORTS.apiName},
                    {label: ADVERTISEMENT.name, value: ADVERTISEMENT.apiName},
                ],
            },
        ],
    },
    {
        name: 'releaseYear',
        id: 'releaseYear',
        label: 'Release Year',
        type: 'text',
        shouldFitContainer: true,
        required: true,
    },
];

const CreateTitleForm = ({value, onChange, close}) => {
    const [error, setError] = React.useState();
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
        <>
            <Form
                renderer={renderer}
                defaultFields={newTitleFormSchema}
                value={value}
                onSubmit={() => {}}
                onChange={(value, isFilled) => {onChange({...value, isFilled});}}
            />
            {error &&
                <ErrorMessage>
                    {error}
                </ErrorMessage>
            }
            <Button onClick={close}>
                {NEW_TITLE_LABEL_CANCEL}
            </Button>
            <Button
                onClick={() => submitTitle(value)}
                isDisabled={!value.isFilled}
                appearance="primary"
            >
                {NEW_TITLE_LABEL_SUBMIT}
            </Button>
        </>
    );
};

export default CreateTitleForm;

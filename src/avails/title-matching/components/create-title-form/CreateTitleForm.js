import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Form, FormFragment} from 'react-forms-processor';
import {renderer} from 'react-forms-processor-atlaskit';
import {ErrorMessage} from '@atlaskit/form';
import Button from '@atlaskit/button';
import {titleService} from '../../../../containers/metadata/service/TitleService';
import {EPISODE, EVENT, SEASON, SPORTS} from '../../../../constants/metadata/contentType';
import constants from './CreateTitleFormConstants';
import DOP from '../../../../util/DOP';
import './CreateTitleForm.scss';

const {
    NEW_TITLE_FORM_SCHEMA,
    NEW_TITLE_LABEL_CANCEL,
    NEW_TITLE_LABEL_SUBMIT,
} = constants;

const CreateTitleForm = ({close, focusedRight}) => {
    // eslint-disable-next-line no-unused-vars
    const [error, setError] = useState();
    const { id: focusedId, title: focusedTitle, contentType: focusedContentType, releaseYear: focusedReleaseYear } = focusedRight;
    const [titleValue, setTitleValue] = useState({
        title: focusedTitle,
        contentType: focusedContentType && focusedContentType.toUpperCase(),
        seriesTitleName: '',
        seasonNumber: '',
        episodeNumber: '',
        releaseYear: focusedReleaseYear,
        isFilled: !!(focusedTitle && focusedContentType && focusedReleaseYear),
    });

    const submitTitle = (title) => {
        // Delete empty properties before sending
        Object.keys(title).forEach(propKey => title[propKey] || delete title[propKey]);
        // Delete helper property
        delete title.isFilled;

        // If a title is of the episodic type group, put together episodic properties in
        // a single prop called 'episodic'. Then delete the leftovers
        const {contentType} = title || {};
        const episodicTypes = [EPISODE.apiName, EVENT.apiName, SEASON.apiName, SPORTS.apiName];

        if (episodicTypes.includes(contentType)) {
            const {seasonNumber, episodeNumber, seriesTitleName} = title || {};
            title.episodic = {
                seasonNumber,
                episodeNumber,
                seriesTitleName
            };

            delete title.seasonNumber;
            delete title.episodeNumber;
            delete title.seriesTitleName;
        }

        // Submit the title to back-end
        titleService.createTitleWithoutErrorModal(title).then(res => {
            DOP.setErrorsCount(0);
            DOP.setData({
                match: {
                    rightId: focusedId,
                    titleId: res.data.id
                }
            });
            close();
        }).catch((error) => {
            const {response: {data: {description, message} = {}} = {}}  = error;
            setError(description || message);
        });
    };

    return (
        <div className="nexus-c-create-title-form">
            <Form
                renderer={renderer}
                value={titleValue}
                onChange={(value, isFilled) => setTitleValue({...value, isFilled})}
            >
                <div className="nexus-c-create-title-form__fields">
                    <FormFragment defaultFields={NEW_TITLE_FORM_SCHEMA} />
                </div>
            </Form>
            {error &&
                <div className="nexus-c-create-title-form__error-message">
                    <ErrorMessage>
                        {error}
                    </ErrorMessage>
                </div>
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
    focusedRight: PropTypes.object,
};

CreateTitleForm.defaultProps = {
    focusedRight: {},
};

export default CreateTitleForm;

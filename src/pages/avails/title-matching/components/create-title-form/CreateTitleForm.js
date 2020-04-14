import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Form, FormFragment} from 'react-forms-processor';
import {renderer} from 'react-forms-processor-atlaskit';
import {ErrorMessage} from '@atlaskit/form';
import Button from '@atlaskit/button';
import './CreateTitleForm.scss';
import {titleService} from '../../../../legacy/containers/metadata/service/TitleService';
import {rightsService} from '../../../../legacy/containers/avail/service/RightsService';
import {EPISODE, EVENT, SEASON, SPORTS} from '../../../../legacy/constants/metadata/contentType';
import constants from './CreateTitleFormConstants';
import DOP from '../../../../../util/DOP';
import {URL} from '../../../../../util/Common';

const {
    NEW_TITLE_LABEL_CANCEL,
    NEW_TITLE_LABEL_SUBMIT,
    getTitleFormSchema
} = constants;

const CreateTitleForm = ({close, focusedRight}) => {
    // eslint-disable-next-line no-unused-vars
    const [error, setError] = useState();
    const { id: focusedId, title: focusedTitle, contentType: focusedContentType, releaseYear: focusedReleaseYear } = focusedRight;
    const initialState = {
        title: focusedTitle,
        contentType: focusedContentType && focusedContentType.toUpperCase(),
        seriesTitleName: '',
        seasonNumber: '',
        episodeNumber: '',
        releaseYear: focusedReleaseYear,
        isFilled: !!(focusedTitle && focusedContentType && focusedReleaseYear),
    };
    const [titleValue, setTitleValue] = useState(initialState);

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
            if(URL.isEmbedded()) {
                DOP.setErrorsCount(0);
                DOP.setData({
                    match: {
                        rightId: focusedId,
                        titleId: res.data.id
                    }
                });
            } else {
                const updatedRight = { coreTitleId: res.data.id };
                rightsService.update(updatedRight, focusedId);
            }
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
                onChange={(value, isFilled) => setTitleValue({...value, isFilled})}
            >
                <div className="nexus-c-create-title-form__fields">
                    <FormFragment defaultFields={getTitleFormSchema(initialState)} />
                </div>
            </Form>
            {error && (
                <div className="nexus-c-create-title-form__error-message">
                    <ErrorMessage>
                        {error}
                    </ErrorMessage>
                </div>
              )}
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

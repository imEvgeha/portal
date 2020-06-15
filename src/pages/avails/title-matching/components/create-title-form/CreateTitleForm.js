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
import {URL, getDomainName} from '../../../../../util/Common';
import withToasts from '../../../../../ui/toast/hoc/withToasts';
import {SUCCESS_ICON, SUCCESS_TITLE} from '../../../../../ui/elements/nexus-toast-notification/constants';

const {
    NEW_TITLE_LABEL_CANCEL,
    NEW_TITLE_LABEL_SUBMIT,
    getTitleFormSchema
} = constants;

// Building a URL where user can check the newly created title
// (Opens in new tab)
const onViewTitleClick = (response) => {
    const {id} = response || {};
    const url = `${getDomainName()}/metadata/detail/${id}`;
    window.open(url, '_blank');
};

const CreateTitleForm = ({close, focusedRight, addToast}) => {
    // eslint-disable-next-line no-unused-vars
    const [error, setError] = useState();
    const { id: focusedId, title: focusedTitle, contentType: focusedContentType, releaseYear: focusedReleaseYear } = focusedRight;
    // TODO: metadata api expects 'AD'
    const parseContentType = contentType => {
        if (contentType) {
            const upperCaseType = contentType.toUpperCase();
            return upperCaseType === 'ADVERTISEMENT' ? 'AD' : upperCaseType;
        }
    };
    const initialState = {
        title: focusedTitle,
        contentType: parseContentType(focusedContentType),
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
            if (seasonNumber || episodeNumber || seriesTitleName) {
                title.episodic = {
                    seasonNumber,
                    episodeNumber,
                    seriesTitleName
                };
            } else {
                title.episodic = null;
            }

            delete title.seasonNumber;
            delete title.episodeNumber;
            delete title.seriesTitleName;
        }

        // Submit the title to back-end
        titleService.createTitleWithoutErrorModal(title).then(res => {
            addToast({
                title: SUCCESS_TITLE,
                icon: SUCCESS_ICON,
                isAutoDismiss: true,
                description: constants.NEW_TITLE_TOAST_SUCCESS_MESSAGE,
                actions: [{ content: 'View title', onClick: () => onViewTitleClick(res)}]
            });
            if (URL.isEmbedded()) {
                DOP.setErrorsCount(0);
                DOP.setData({
                    match: {
                        rightId: focusedId,
                        titleId: res.id
                    }
                });
            } else {
                const updatedRight = { coreTitleId: res.id };
                rightsService.update(updatedRight, focusedId);
            }
            close();
        }).catch((error) => {
            const {message: {description, bindingResult} = {}} = error;

            setError(description || bindingResult);
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

export default withToasts(CreateTitleForm);

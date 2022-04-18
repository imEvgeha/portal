import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {ErrorMessage} from '@atlaskit/form';
import ToastBody from '@vubiquity-nexus/portal-ui/lib/toast/components/toast-body/ToastBody';
import {SUCCESS_TITLE} from '@vubiquity-nexus/portal-ui/lib/toast/constants';
import withToasts from '@vubiquity-nexus/portal-ui/lib/toast/hoc/withToasts';
import {getDomainName, URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import DOP from '@vubiquity-nexus/portal-utils/lib/DOP';
import {Button as PrimeReactButton} from 'primereact/button';
import {Form, FormFragment} from 'react-forms-processor';
import {renderer} from 'react-forms-processor-atlaskit';
import {useParams} from 'react-router-dom';
import './CreateTitleForm.scss';
import {rightsService} from '../../../../legacy/containers/avail/service/RightsService';
import {titleService} from '../../../../legacy/containers/metadata/service/TitleService';
import {EPISODE, EVENT, SEASON, SPECIAL, SPORTS} from '../../../../metadata/constants/contentType';
import constants from '../../../../title-metadata/components/titleCreateModal/TitleCreateModalConstants';

const {NEW_TITLE_LABEL_CANCEL, NEW_TITLE_LABEL_SUBMIT, getTitleFormSchema} = constants;

const CreateTitleForm = ({close, focusedRight, addToast, bulkTitleMatch}) => {
    const [error, setError] = useState();
    const {
        id: focusedId,
        title: focusedTitle,
        contentType: focusedContentType,
        releaseYear: focusedReleaseYear,
    } = focusedRight;
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
    const routeParams = useParams();

    const onViewTitleClick = id => {
        window.open(`${getDomainName()}/${routeParams.realm}/metadata/detail/${id}`, '_blank');
    };

    const submitTitle = title => {
        // Delete empty properties before sending
        Object.keys(title).forEach(propKey => title[propKey] || delete title[propKey]);
        // Delete helper property
        delete title.isFilled;

        // If a title is of the episodic type group, put together episodic properties in
        // a single prop called 'episodic'. Then delete the leftovers
        const {contentType} = title || {};
        const episodicTypes = [EPISODE.apiName, EVENT.apiName, SEASON.apiName, SPORTS.apiName, SPECIAL.apiName];

        if (episodicTypes.includes(contentType)) {
            const {seasonNumber, episodeNumber, seriesTitleName} = title || {};
            if (seasonNumber || episodeNumber || seriesTitleName) {
                title.episodic = {
                    seasonNumber,
                    episodeNumber,
                    seriesTitleName,
                };
            } else {
                title.episodic = null;
            }

            delete title.seasonNumber;
            delete title.episodeNumber;
            delete title.seriesTitleName;
        }

        // Submit the title to back-end
        titleService
            .createTitleWithoutErrorModal(title)
            .then(res => {
                const titleId = res.id;
                addToast({
                    severity: 'success',
                    content: (
                        <ToastBody
                            summary={SUCCESS_TITLE}
                            detail={constants.NEW_TITLE_TOAST_SUCCESS_MESSAGE}
                            severity="success"
                        >
                            <PrimeReactButton
                                label="View Title"
                                className="p-button-link p-toast-button-link"
                                onClick={() => onViewTitleClick(titleId)}
                            />
                        </ToastBody>
                    ),
                });
                if (URL.isEmbedded()) {
                    DOP.setErrorsCount(0);
                    DOP.setData({
                        match: {
                            rightId: focusedId,
                            titleId: res.id,
                        },
                    });
                } else if (bulkTitleMatch) {
                    bulkTitleMatch(titleId, true);
                } else {
                    const updatedRight = {coreTitleId: res.id};
                    rightsService.update(updatedRight, focusedId);
                }
                close();
            })
            .catch(error => {
                const {message: {description, bindingResult} = {}} = error;

                setError(description || bindingResult);
            });
    };

    return (
        <div className="nexus-c-create-title-form">
            <Form renderer={renderer} onChange={(value, isFilled) => setTitleValue({...value, isFilled})}>
                <div className="nexus-c-create-title-form__fields">
                    <FormFragment defaultFields={getTitleFormSchema(initialState)} />
                </div>
            </Form>
            {error && (
                <div className="nexus-c-create-title-form__error-message">
                    <ErrorMessage>{error}</ErrorMessage>
                </div>
            )}
            <div className="nexus-c-create-title-form__action-buttons">
                <Button onClick={close}>{NEW_TITLE_LABEL_CANCEL}</Button>
                <Button onClick={() => submitTitle(titleValue)} isDisabled={!titleValue.isFilled} appearance="primary">
                    {NEW_TITLE_LABEL_SUBMIT}
                </Button>
            </div>
        </div>
    );
};

CreateTitleForm.propTypes = {
    close: PropTypes.func.isRequired,
    focusedRight: PropTypes.object,
    bulkTitleMatch: PropTypes.func,
    addToast: PropTypes.func,
};

CreateTitleForm.defaultProps = {
    focusedRight: {},
    bulkTitleMatch: null,
    addToast: () => null,
};

export default withToasts(CreateTitleForm);

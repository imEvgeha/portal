import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Button, {ButtonGroup} from '@atlaskit/button';
import ToastBody from '@vubiquity-nexus/portal-ui/lib/toast/components/toast-body/ToastBody';
import {
    TITLE_MATCH_AND_CREATE_WARNING_MESSAGE,
    TITLE_MATCH_SUCCESS_MESSAGE,
    WARNING_TITLE,
    SUCCESS_TITLE,
} from '@vubiquity-nexus/portal-ui/lib/toast/constants';
import withToasts from '@vubiquity-nexus/portal-ui/lib/toast/hoc/withToasts';
import {getDomainName, URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import DOP from '@vubiquity-nexus/portal-utils/lib/DOP';
import {Button as PrimeReactButton} from 'primereact/button';
import {rightsService} from '../../../legacy/containers/avail/service/RightsService';
import TitleSystems from '../../../metadata/constants/systems';

const {NEXUS, MOVIDA, VZ} = TitleSystems;

const ActionsBar = ({matchList, mergeTitles, rightId, addToast, removeToast, isMerging}) => {
    const [buttonStatus, setButtonStatus] = useState({
        match: false,
        matchAndCreate: false,
    });

    useEffect(() => {
        setButtonStatus({
            match: matchList[NEXUS],
            matchAndCreate: matchList[MOVIDA] || matchList[VZ],
        });
    }, [matchList]);

    const onCancel = () => {
        // future implementation
    };

    const onMatch = () => {
        const url = `${getDomainName()}/metadata/detail/${matchList[NEXUS].id}`;
        const handleLinkClick = e => {
            e.preventDefault();
            window.open(url, '_blank');
        };

        if (URL.isEmbedded()) {
            DOP.setErrorsCount(0);
            DOP.setData({
                match: {
                    rightId,
                    titleId: matchList[NEXUS].id,
                },
            });
        } else {
            const updatedRight = {coreTitleId: matchList[NEXUS].id};
            rightsService.update(updatedRight, rightId);
        }

        addToast({
            severity: 'success',
            content: (
                <ToastBody summary={SUCCESS_TITLE} detail={TITLE_MATCH_SUCCESS_MESSAGE} severity="success">
                    <PrimeReactButton
                        label="View Title"
                        className="p-button-link p-toast-button-link"
                        onClick={handleLinkClick}
                    />
                </ToastBody>
            ),
        });
    };

    const mergeSingle = e => {
        e.preventDefault();
        removeToast();
        mergeTitles();
    };

    const onMatchAndCreate = () => {
        if (Object.keys(matchList).length === 1) {
            addToast({
                severity: 'warn',
                closable: false,
                content: (
                    <ToastBody summary={WARNING_TITLE} detail={TITLE_MATCH_AND_CREATE_WARNING_MESSAGE} severity="warn">
                        <div className="d-flex align-items-center">
                            <PrimeReactButton
                                label="Cancel"
                                className="p-button-link p-toast-cancel-button"
                                onClick={() => removeToast()}
                            />
                            <PrimeReactButton
                                label="Continue"
                                className="p-button-link p-toast-confirm-button"
                                onClick={mergeSingle}
                            />
                        </div>
                    </ToastBody>
                ),
                sticky: true,
            });
        } else {
            mergeTitles();
        }
    };

    return (
        <div className="nexus-c-title-matching-custom-actions">
            <ButtonGroup>
                <Button onClick={onCancel} className="nexus-c-button">
                    Cancel
                </Button>
                <Button
                    onClick={onMatch}
                    isDisabled={!buttonStatus.match}
                    className="nexus-c-button"
                    appearance="primary"
                >
                    Match
                </Button>
                <Button
                    onClick={onMatchAndCreate}
                    isDisabled={!buttonStatus.matchAndCreate}
                    className="nexus-c-button"
                    appearance="primary"
                    isLoading={isMerging}
                >
                    Match & Create
                </Button>
            </ButtonGroup>
        </div>
    );
};
ActionsBar.propTypes = {
    matchList: PropTypes.object,
    mergeTitles: PropTypes.func,
    addToast: PropTypes.func,
    removeToast: PropTypes.func,
    rightId: PropTypes.string.isRequired,
    isMerging: PropTypes.bool,
};

ActionsBar.defaultProps = {
    matchList: {},
    addToast: () => null,
    removeToast: () => null,
    mergeTitles: () => null,
    isMerging: false,
};

export default withToasts(ActionsBar);

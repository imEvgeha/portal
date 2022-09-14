import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Button} from '@portal/portal-components';
import {addToast} from '@vubiquity-nexus/portal-ui/lib/toast/NexusToastNotificationActions';
import {
    TITLE_MATCH_AND_CREATE_WARNING_MESSAGE,
    TITLE_MATCH_SUCCESS_MESSAGE,
} from '@vubiquity-nexus/portal-ui/lib/toast/constants';
import {getDomainName, URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import DOP from '@vubiquity-nexus/portal-utils/lib/DOP';
import {Button as PrimeReactButton} from 'primereact/button';
import {useDispatch} from 'react-redux';
import {rightsService} from '../../../legacy/containers/avail/service/RightsService';
import TitleSystems from '../../../metadata/constants/systems';

const {NEXUS, MOVIDA, VZ} = TitleSystems;

const ActionsBar = ({matchList, mergeTitles, rightId, removeToast, isMerging}) => {
    const dispatch = useDispatch();
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

        dispatch(
            addToast({
                severity: 'success',
                detail: TITLE_MATCH_SUCCESS_MESSAGE,
                content: () => (
                    <PrimeReactButton
                        label="View Title"
                        className="p-button-link p-toast-button-link"
                        onClick={handleLinkClick}
                    />
                ),
            })
        );
    };

    const mergeSingle = e => {
        e.preventDefault();
        removeToast();
        mergeTitles();
    };

    const onMatchAndCreate = () => {
        if (Object.keys(matchList).length === 1) {
            dispatch(
                addToast({
                    severity: 'warn',
                    detail: TITLE_MATCH_AND_CREATE_WARNING_MESSAGE,
                    content: () => (
                        <div className="no-padding d-flex align-items-center">
                            <PrimeReactButton
                                label="Cancel"
                                className="p-button-link p-toast-left-button"
                                onClick={() => removeToast()}
                            />
                            <PrimeReactButton
                                label="Continue"
                                className="p-button-link p-toast-right-button"
                                onClick={mergeSingle}
                            />
                        </div>
                    ),
                    sticky: true,
                })
            );
        } else {
            mergeTitles();
        }
    };

    return (
        <div className="nexus-c-title-matching-custom-actions">
            <Button label="Cancel" onClick={onCancel} className="p-button-outlined p-button-secondary nexus-c-button" />
            <Button
                label="Match"
                onClick={onMatch}
                disabled={!buttonStatus.match}
                className="p-button-outlined p-button-secondary nexus-c-button"
            />
            <Button
                label="Match & Create"
                onClick={onMatchAndCreate}
                disabled={!buttonStatus.matchAndCreate}
                className="p-button-outlined p-button-secondary nexus-c-button"
                loading={isMerging}
            />
        </div>
    );
};
ActionsBar.propTypes = {
    matchList: PropTypes.object,
    mergeTitles: PropTypes.func,
    removeToast: PropTypes.func,
    rightId: PropTypes.string.isRequired,
    isMerging: PropTypes.bool,
};

ActionsBar.defaultProps = {
    matchList: {},
    removeToast: () => null,
    mergeTitles: () => null,
    isMerging: false,
};

export default ActionsBar;

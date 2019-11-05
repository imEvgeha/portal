import React, {useEffect, useState, useContext} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import DOP from '../../../util/DOP';
import Constants from '../titleMatchingConstants';
import NexusToastNotificationContext from '../../../ui-elements/nexus-toast-notification/NexusToastNotificationContext';
import {
    TITLE_MATCH_AND_CREATE_WARNING_MESSAGE,
    TITLE_MATCH_SUCCESS_MESSAGE,
    WARNING_TITLE,
    SUCCESS_TITLE,
    WARNING_ICON,
    SUCCESS_ICON,
} from '../../../ui-elements/nexus-toast-notification/constants';
import {getDomainName} from '../../../util/Common';

const ActionsBar = ({matchList, mergeTitles, rightId}) => {
    const {NEXUS, MOVIDA, VZ} = Constants.repository;
    const [buttonStatus, setButtonStatus] = useState({
        match: false,
        matchAndCreate: false,
    });
    const {addToast, removeToast} = useContext(NexusToastNotificationContext);

    useEffect(() => {
        setButtonStatus({
            match: matchList[NEXUS],
            matchAndCreate: matchList[MOVIDA] || matchList[VZ],
        });
    }, [matchList]);

    const onCancel = () => {
      //future implementation
    };

    const onMatch = () => {
        const url = `${getDomainName()}/metadata/detail/${matchList[NEXUS].id}`;
        const onViewTitleClick = () => window.open(url,'_blank');
        DOP.setErrorsCount(0);
        DOP.setData({
            match: {
                rightId,
                titleId: matchList[NEXUS].id
            }
        });
        addToast({
            title: SUCCESS_TITLE,
            description: TITLE_MATCH_SUCCESS_MESSAGE,
            icon: SUCCESS_ICON,
            actions: [
                {content: 'View Title', onClick: onViewTitleClick}
            ],
            isWithOverlay: true,
        });
    };

    const onMatchAndCreate = () => {
        if(Object.keys(matchList).length === 1){
            addToast({
                title: WARNING_TITLE,
                description: TITLE_MATCH_AND_CREATE_WARNING_MESSAGE,
                icon: WARNING_ICON,
                actions: [
                    {content:'Cancel', onClick: removeToast},
                    {content: 'Ok', onClick: mergeTitles}
                ],
                isWithOverlay: true,
            });
        }
        else{
            mergeTitles();
        }
    };

    return (
        <React.Fragment>
            <div className="nexus-c-title-matching-custom-actions">
                <Button onClick={onCancel}>
                    Cancel
                </Button>
                <Button
                    onClick={onMatch}
                    className={`nexus-c-title-matching-custom-actions__button${buttonStatus.match ? '--active' : ''}`}>
                    Match
                </Button>
                <Button
                    onClick={onMatchAndCreate}
                    className={`nexus-c-title-matching-custom-actions__button${buttonStatus.matchAndCreate ? '--active' : ''}`}>
                    Match & Create
                </Button>
            </div>
        </React.Fragment>
    );
};
ActionsBar.propTypes = {
    matchList: PropTypes.object,
    mergeTitles: PropTypes.func,
    rightId: PropTypes.string.isRequired,
};

ActionsBar.defaultProps = {
    matchList: {},
};


export default ActionsBar;

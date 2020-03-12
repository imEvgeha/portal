import React, {useEffect, useState, useContext} from 'react';
import PropTypes from 'prop-types';
import Button, {ButtonGroup} from '@atlaskit/button';
import DOP from '../../../util/DOP';
import TitleSystems from '../../../constants/metadata/systems';
import {
    WARNING_TITLE,
    SUCCESS_TITLE,
    WARNING_ICON,
    SUCCESS_ICON,
} from '../../../ui/elements/nexus-toast-notification/constants';
import {
    TITLE_MATCH_AND_CREATE_WARNING_MESSAGE,
    TITLE_MATCH_SUCCESS_MESSAGE,
} from '../../../ui/toast/constants';
import {getDomainName, URL} from '../../../util/Common';
import {rightsService} from '../../../containers/avail/service/RightsService';
import withToasts from '../../../ui/toast/hoc/withToasts';

const ActionsBar = ({matchList, mergeTitles, rightId, addToast, removeToast}) => {
    const {NEXUS, MOVIDA, VZ} = TitleSystems;
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
      //future implementation
    };

    const onMatch = () => {
        const url = `${getDomainName()}/metadata/detail/${matchList[NEXUS].id}`;
        const inViewTitleClick = () => window.open(url,'_blank');

        if (URL.isEmbedded()) {
            DOP.setErrorsCount(0);
            DOP.setData({
                match: {
                    rightId,
                    titleId: matchList[NEXUS].id
                }
            });
        } else {
            const updatedRight = { 'coreTitleId': matchList[NEXUS].id };
            rightsService.update(updatedRight, rightId);
        }

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

    const mergeSingle = () => {
        removeToast();
        mergeTitles();
    };

    const onMatchAndCreate = () => {
        if(Object.keys(matchList).length === 1){
            addToast({
                title: WARNING_TITLE,
                description: TITLE_MATCH_AND_CREATE_WARNING_MESSAGE,
                icon: WARNING_ICON,
                actions: [
                    {content:'Cancel', onClick: removeToast},
                    {content: 'Ok', onClick: mergeSingle}
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
                <ButtonGroup>
                    <Button
                        onClick={onCancel}
                        className="nexus-c-button"
                    >
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
                    >
                        Match & Create
                    </Button>
                </ButtonGroup>
            </div>
        </React.Fragment>
    );
};
ActionsBar.propTypes = {
    matchList: PropTypes.object,
    mergeTitles: PropTypes.func,
    addToast: PropTypes.func,
    removeToast: PropTypes.func,
    rightId: PropTypes.string.isRequired,
};

ActionsBar.defaultProps = {
    matchList: {},
    addToast: () => null,
    removeToast: () => null,
};

export default withToasts(ActionsBar);

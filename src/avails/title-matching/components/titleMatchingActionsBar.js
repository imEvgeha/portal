import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import Constants from '../titleMatchingConstants';

const ActionsBar = ({matchList, selectTitles}) => {
    const {NEXUS, MOVIDA, VZ} = Constants.repository;
    const [buttonStatus, setButtonStatus] = useState({
        match: false,
        matchAndCreate: false,
    });

    const onCancel = () => {
      //future implementation
    };

    const onMatch = () => {
      //future implementation (gets the matchList in the props)
    };

    const onMatchAndCreate = () => {
        selectTitles();
    };

    useEffect(() => {
        setButtonStatus({
            match: matchList[NEXUS],
            matchAndCreate: matchList[MOVIDA] || matchList[VZ],
        });
    }, [matchList]);

    return (
        <React.Fragment>
            <div className="nexus-c-title-matching-custom-actions">
                <Button onClick={onCancel}>
                    Cancel
                </Button>
                <Button onClick={onMatch}
                        className={`nexus-c-title-matching-custom-actions__button${buttonStatus.match ? '--active' : ''}`}>
                    Match
                </Button>
                <Button onClick={onMatchAndCreate}
                        className={`nexus-c-title-matching-custom-actions__button${buttonStatus.matchAndCreate ? '--active' : ''}`}>
                    Match & Create
                </Button>
            </div>
        </React.Fragment>
    );
};
ActionsBar.propTypes = {
    matchList: PropTypes.object,
    selectTitles: PropTypes.func,
};

ActionsBar.defaultProps = {
    matchList: {},
};


export default ActionsBar;
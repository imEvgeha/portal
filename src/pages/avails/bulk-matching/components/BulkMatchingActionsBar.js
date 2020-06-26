import React, {useEffect, useState, useContext} from 'react';
import PropTypes from 'prop-types';
import Button, {ButtonGroup} from '@atlaskit/button';
import TitleSystems from '../../../legacy/constants/metadata/systems';
import './BulkMatchingActionsBar.scss';

const BulkMatchingActionsBar = ({matchList, onCancel, onMatch, onMatchAndCreate}) => {
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

    return (
        <div className="nexus-c-bulk-actions-bar">
            <ButtonGroup>
                <Button
                    onClick={onCancel}
                    className="nexus-c-bulk-actions-bar__btn"
                >
                    Cancel
                </Button>
                <Button
                    onClick={onMatch}
                    isDisabled={!buttonStatus.match}
                    className="nexus-c-bulk-actions-bar__btn"
                    appearance="primary"
                >
                    Match
                </Button>
                <Button
                    onClick={onMatchAndCreate}
                    isDisabled={!buttonStatus.matchAndCreate}
                    className="nexus-c-bulk-actions-bar__btn"
                    appearance="primary"
                >
                    Match & Create
                </Button>
            </ButtonGroup>
        </div>
    );
};
BulkMatchingActionsBar.propTypes = {
    matchList: PropTypes.object,
    onCancel: PropTypes.func,
    onMatch: PropTypes.func,
    onMatchAndCreate: PropTypes.func,
};

BulkMatchingActionsBar.defaultProps = {
    matchList: {},
    onCancel: () => null,
    onMatch: () => null,
    onMatchAndCreate: () => null,
};

export default BulkMatchingActionsBar;

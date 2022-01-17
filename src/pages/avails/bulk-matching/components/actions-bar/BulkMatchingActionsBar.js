import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Button, {ButtonGroup} from '@atlaskit/button';
import TitleSystems from '../../../../metadata/constants/systems';
import './BulkMatchingActionsBar.scss';

const BulkMatchingActionsBar = ({
    matchList,
    onCancel,
    onMatch,
    onMatchAndCreate,
    isMatchLoading,
    isMatchAndCreateLoading,
}) => {
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
    }, [MOVIDA, NEXUS, VZ, matchList]);

    return (
        <div className="nexus-c-bulk-actions-bar">
            <ButtonGroup>
                <Button
                    onClick={onCancel}
                    className="nexus-c-bulk-actions-bar__btn"
                    isDisabled={isMatchLoading || isMatchAndCreateLoading}
                >
                    Cancel
                </Button>
                <Button
                    onClick={onMatch}
                    isDisabled={!buttonStatus.match}
                    isLoading={isMatchLoading}
                    className="nexus-c-bulk-actions-bar__btn"
                    appearance="primary"
                >
                    Match
                </Button>
                <Button
                    onClick={onMatchAndCreate}
                    isDisabled={!buttonStatus.matchAndCreate}
                    isLoading={isMatchAndCreateLoading}
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
    matchList: PropTypes.array,
    onCancel: PropTypes.func,
    onMatch: PropTypes.func,
    onMatchAndCreate: PropTypes.func,
    isMatchLoading: PropTypes.bool,
    isMatchAndCreateLoading: PropTypes.bool,
};

BulkMatchingActionsBar.defaultProps = {
    matchList: [],
    onCancel: () => null,
    onMatch: () => null,
    onMatchAndCreate: () => null,
    isMatchLoading: false,
    isMatchAndCreateLoading: false,
};

export default BulkMatchingActionsBar;

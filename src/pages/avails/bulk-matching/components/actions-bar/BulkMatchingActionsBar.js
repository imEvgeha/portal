import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Button} from '@portal/portal-components';
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
            <Button
                label="Cancel"
                onClick={onCancel}
                className="p-button-outlined p-button-secondary nexus-c-bulk-actions-bar__btn mx-1"
                disabled={isMatchLoading || isMatchAndCreateLoading}
            />
            <Button
                label="Match"
                onClick={onMatch}
                disabled={!buttonStatus.match}
                loading={isMatchLoading}
                className="p-button-outlined p-button-secondary nexus-c-bulk-actions-bar__btn mx-1"
            />
            <Button
                label="Match & Create"
                onClick={onMatchAndCreate}
                disabled={!buttonStatus.matchAndCreate}
                loading={isMatchAndCreateLoading}
                className="p-button-outlined p-button-secondary nexus-c-bulk-actions-bar__btn mx-1"
            />
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

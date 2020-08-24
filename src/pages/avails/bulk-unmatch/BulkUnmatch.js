import React, {useContext, useEffect, useState, useCallback} from 'react';
import PropTypes from 'prop-types';
import SectionMessage from '@atlaskit/section-message';
import {connect} from 'react-redux';
import NexusGrid from '../../../ui/elements/nexus-grid/NexusGrid';
import {NexusModalContext} from '../../../ui/elements/nexus-modal/NexusModal';
import {SUCCESS_ICON} from '../../../ui/elements/nexus-toast-notification/constants';
import {getAffectedRights, setCoreTitleId} from '../bulk-matching/bulkMatchingService';
import {createRightMatchingColumnDefsSelector} from '../right-matching/rightMatchingSelectors';
import {BULK_UNMATCH_SUCCESS_TOAST} from '../selected-rights-actions/constants';
import {BULK_UNMATCH_CANCEL_BTN, BULK_UNMATCH_CONFIRM_BTN, BULK_UNMATCH_WARNING} from './constants';
import './BulkUnmatch.scss';

const BulkUnmatch = ({
    selectedRights = [],
    columnDefs = [],
    removeToast,
    addToast,
    selectedRightGridApi,
    toggleRefreshGridData,
}) => {
    const [affectedRights, setAffectedRights] = useState([]);
    const {setModalActions, setModalStyle, close} = useContext(NexusModalContext);

    const unMatchHandler = useCallback(
        rightIds => {
            setCoreTitleId({rightIds}).then(unmatchedRights => {
                // Fetch fresh data from back-end
                toggleRefreshGridData(true);

                // Response is returning updated rights, so we can feed that to SelectedRights table
                selectedRightGridApi.setRowData(unmatchedRights.filter(right => selectedRights.includes(right.id)));
                // Refresh changes
                selectedRightGridApi.refreshCells();

                // Close modal
                close();

                // Show success toast
                addToast({
                    title: BULK_UNMATCH_SUCCESS_TOAST,
                    description: `You have successfully unmatched ${unmatchedRights.length} right(s).
                         Please validate title fields.`,
                    icon: SUCCESS_ICON,
                    isAutoDismiss: true,
                });
            });
        },
        [addToast, close, selectedRightGridApi, selectedRights, toggleRefreshGridData]
    );

    useEffect(
        () => {
            setModalStyle({width: '70%'});
            getAffectedRights(selectedRights).then(rights => {
                setModalActions([
                    {
                        text: BULK_UNMATCH_CANCEL_BTN,
                        onClick: () => {
                            close();
                            removeToast();
                        },
                        appearance: 'default',
                    },
                    {
                        text: BULK_UNMATCH_CONFIRM_BTN,
                        onClick: () => unMatchHandler(rights.map(right => right.id)),
                        appearance: 'primary',
                    },
                ]);
                setAffectedRights(rights);
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedRights]
    );

    return (
        <div className="nexus-c-bulk-unmatch">
            <p className="nexus-c-bulk-unmatch__confirmation-message">
                {`Core title ID's will be removed from ${affectedRights.length} right(s). Do you want to continue?`}
            </p>
            {!!affectedRights.length && (
                <>
                    <SectionMessage appearance="warning">
                        <p>{BULK_UNMATCH_WARNING}</p>
                    </SectionMessage>
                    <NexusGrid rowData={affectedRights} columnDefs={columnDefs} />
                </>
            )}
        </div>
    );
};

BulkUnmatch.propTypes = {
    selectedRights: PropTypes.array.isRequired,
    columnDefs: PropTypes.array.isRequired,
    removeToast: PropTypes.func.isRequired,
    addToast: PropTypes.func.isRequired,
    selectedRightGridApi: PropTypes.object.isRequired,
    toggleRefreshGridData: PropTypes.func.isRequired,
};

const createMapStateToProps = () => {
    const rightMatchingColumnDefsSelector = createRightMatchingColumnDefsSelector();

    return (state, props) => ({
        columnDefs: rightMatchingColumnDefsSelector(state, props),
    });
};

export default connect(createMapStateToProps)(BulkUnmatch);

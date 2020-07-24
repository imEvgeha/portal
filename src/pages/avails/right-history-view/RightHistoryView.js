import React, {useCallback, useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Spinner from '@atlaskit/spinner';
import {connect} from 'react-redux';
import {NexusModalContext} from '../../../ui/elements/nexus-modal/NexusModal';
import AuditHistoryTable from '../../legacy/components/AuditHistoryTable/AuditHistoryTable';
import {fetchRightsHistory} from './rightHistoryActions';
import {getRightsEventHistorySelector} from './rightHistorySelectors';
import './RightHistoryView.scss';

const SPINNER = (
    <div style={{textAlign: 'center'}}>
        <Spinner size="medium" />
    </div>
);

const RightHistoryView = ({selectedAvails, rightsEventHistory, fetchRightsHistory}) => {

    const {setModalContentAndTitle, setModalActions, setModalStyle, close, isOpened} = useContext(NexusModalContext);

    const title = `Audit History (${selectedAvails.length})`;

    const buildContent = useCallback(() => {
        return (
            <div>
                {selectedAvails.map((avail, index) => (
                    <AuditHistoryTable key={avail.id} focusedRight={avail} data={rightsEventHistory[index]} />
                ))}
            </div>
        );
    }, [rightsEventHistory, selectedAvails]);

    useEffect(() => {
        if (isOpened) {
            setModalStyle({width: '100%'});
            setModalContentAndTitle(buildContent(), title);
        }
    }, [title, buildContent, isOpened, rightsEventHistory, setModalContentAndTitle, setModalStyle]);


    const openHistoryModal = () => {
        const ids = selectedAvails.map(e => e.id);
        fetchRightsHistory(ids);
        setModalActions([{
            text: 'Done',
            onClick: () => {
                close();
            },
        }]);
        setModalContentAndTitle(SPINNER, title);
    };

    return (
        <span
            onClick={openHistoryModal}
        >
            View Audit History
        </span>
    );
};

RightHistoryView.propTypes = {
    selectedAvails: PropTypes.array.isRequired,
    fetchRightsHistory: PropTypes.func.isRequired,
    rightsEventHistory: PropTypes.array.isRequired,
};

const mapStateToProps = () => {
    const rightsEventHistorySelector = getRightsEventHistorySelector();

    return (state, props) => ({
        rightsEventHistory: rightsEventHistorySelector(state, props),
    });
};

const mapDispatchToProps = dispatch => ({
    fetchRightsHistory: payload => dispatch(fetchRightsHistory(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RightHistoryView);

import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Spinner from '@atlaskit/spinner';
import {NexusModalContext} from '../../ui-elements/nexus-modal/NexusModal';
import {getRightsEventHistorySelector} from './rightHistorySelectors';
import {fetchRightsHistory} from './rightHistoryActions';
import AuditHistoryTable from '../../components/AuditHistoryTable/AuditHistoryTable';

const SPINNER = (
    <div style={{textAlign: 'center'}}>
        <Spinner size="medium" />
    </div>
  );

function RightHistoryView({selectedAvails, rightsEventHistory, fetchRightsHistory}) {

    const [opened, setOpened] = useState(false);

    const {setModalContentAndTitle, setModalActions, setModalStyle, close} = useContext(NexusModalContext);

    const TITLE = `Audit History (${selectedAvails.length})`;

    useEffect(() => {
        if (opened) {
            setModalStyle({width: '100%'});
            setModalContentAndTitle(buildContent(), TITLE);
        }
    }, [rightsEventHistory]);

    const buildContent = () => {
        return (
            <div>
                {selectedAvails.map((avail, index) => (
                    <AuditHistoryTable key={avail.id} focusedRight={avail} data={rightsEventHistory[index]} />
                    )
                )}
            </div>
        );
    };

    const openHistoryModal = () => {
        const ids = selectedAvails.map(e => e.id);
        fetchRightsHistory(ids);
        setModalActions([{
            text: 'Done',
            onClick: () => {
                close();
                setOpened(false);
            }
        }]);
        setModalContentAndTitle(SPINNER, TITLE);
        setOpened(true);
    };

    return (
        (selectedAvails.length > 0) && (
            <a href="#" onClick={openHistoryModal}>
                <span className='nx-container-margin table-top-text'>
                    View History
                </span>
            </a>
        )
    );
}

RightHistoryView.propTypes = {
    selectedAvails: PropTypes.array.isRequired,
    fetchRightsHistory: PropTypes.func.isRequired,
    rightsEventHistory: PropTypes.array.isRequired
};

const mapStateToProps = () => {
    const rightsEventHistorySelector = getRightsEventHistorySelector();

    return (state, props) => ({
        selectedAvails: state.dashboard.session.availTabPageSelection.selected,
        rightsEventHistory: rightsEventHistorySelector(state, props)
    });
};

const mapDispatchToProps = (dispatch) => ({
    fetchRightsHistory: payload => dispatch(fetchRightsHistory(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(RightHistoryView);
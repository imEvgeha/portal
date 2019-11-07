import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Spinner from '@atlaskit/spinner';
import {NexusModalContext} from '../../ui-elements/nexus-modal/NexusModal';
import {getRightsEventHistorySelector} from './rightHistorySelectors';
import {fetchRightsHistory} from './rightHistoryActions';
import AuditHistoryTable from '../../components/AuditHistoryTable/AuditHistoryTable';

const SPINNER =
    <div style={{textAlign: 'center'}}>
        <Spinner size="medium"/>
    </div>;

function RightHistoryView({selectedAvails, rightsEventHistory, fetchRightsHistory}) {

    const [opened, setOpened] = useState(false);

    const {setModalContent, setModalActions, setModalStyle, close} = useContext(NexusModalContext);

    useEffect(() => {
        setModalStyle({width: '100%'});
    }, []);

    useEffect(() => {
        if (opened && rightsEventHistory.length > 0) {
            setModalContent(buildContent());
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

        setModalContent(SPINNER);
        setOpened(true);
    };

    if (selectedAvails.length > 0) {
        return (
            <a href={'#'} onClick={openHistoryModal}>
                <span className={'nx-container-margin table-top-text'}>
                    View History
                </span>
            </a>
        );
    } else {
        return '';
    }

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
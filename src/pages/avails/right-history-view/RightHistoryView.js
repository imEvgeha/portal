import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Spinner from '@atlaskit/spinner';
import {NexusModalContext} from '../../../ui/elements/nexus-modal/NexusModal';
import {getRightsEventHistorySelector} from './rightHistorySelectors';
import {fetchRightsHistory} from './rightHistoryActions';
import AuditHistoryTable from '../../legacy/components/AuditHistoryTable/AuditHistoryTable';
import './RightHistoryView.scss';

const SPINNER = (
    <div style={{textAlign: 'center'}}>
        <Spinner size="medium" />
    </div>
  );

const RightHistoryView = ({selectedAvails, rightsEventHistory, fetchRightsHistory}) => {

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
        <span
            onClick={openHistoryModal}
            className={`
                nx-container-margin
                table-top-text
                view-history-link
                ${selectedAvails.length > 0 ? 'active-link' :''}
            `}
        >
            View Audit History
        </span>
    );
};

RightHistoryView.propTypes = {
    selectedAvails: PropTypes.array.isRequired,
    fetchRightsHistory: PropTypes.func.isRequired,
    rightsEventHistory: PropTypes.array.isRequired
};

const mapStateToProps = () => {
    const rightsEventHistorySelector = getRightsEventHistorySelector();

    return (state, props) => ({
        rightsEventHistory: rightsEventHistorySelector(state, props)
    });
};

const mapDispatchToProps = (dispatch) => ({
    fetchRightsHistory: payload => dispatch(fetchRightsHistory(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(RightHistoryView);

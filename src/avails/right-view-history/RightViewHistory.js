import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {NexusModalContext} from '../../ui-elements/nexus-modal/NexusModal';

function RightViewHistory({selectedAvails}) {

    const [isOpen, setIsOpen] = useState(false);

    const {setModalContent, setModalActions, close} = useContext(NexusModalContext);
    
    return (
        <a href={'#'}>
            <span className={'nx-container-margin table-top-text'}>
                View History
            </span>
        </a>
    );
}

RightViewHistory.propTypes = {
    selectedAvails: PropTypes.array.isRequired
};

const mapStateToProps = state => {
    return {
        selectedAvails: state.dashboard.session.availTabPageSelection.selected,
    };
};

export default connect(mapStateToProps, null)(RightViewHistory);
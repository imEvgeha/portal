import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import {connect} from 'react-redux';
import {toggleRefreshGridData} from '../../ui/grid/gridActions';
import TitleCreate from '../legacy/containers/metadata/dashboard/components/TitleCreateModal'; // replace with new component
import TitleMetadataHeader from './components/title-metadata-header/TitleMetadataHeader';
import TitleMetadataTable from './components/title-metadata-table/TitleMetadataTable';
import {CREATE_NEW_TITLE, SYNC_LOG} from './constants';
import './TitleMetadataView.scss';

export const TitleMetadataView = ({history, toggleRefreshGridData}) => {
    const [showModal, setShowModal] = useState(false);

    const closeModalAndRefreshTable = () => {
        setShowModal(false);
        toggleRefreshGridData(true);
    };

    return (
        <div className="nexus-c-title-metadata">
            <TitleMetadataHeader>
                <Button
                    className="nexus-c-title-metadata__create-btn"
                    appearance="primary"
                    onClick={() => setShowModal(true)}
                >
                    {CREATE_NEW_TITLE}
                </Button>
                <Button
                    className="nexus-c-title-metadata__sync-btn"
                    appearance="subtle"
                    onClick={() => history.push(URL.keepEmbedded('/metadata/sync-log'))}
                >
                    {SYNC_LOG}
                </Button>
            </TitleMetadataHeader>
            <TitleMetadataTable history={history} />
            <TitleCreate display={showModal} toggle={closeModalAndRefreshTable} />
        </div>
    );
};

const mapDispatchToProps = dispatch => ({
    toggleRefreshGridData: payload => dispatch(toggleRefreshGridData(payload)),
});

TitleMetadataView.propTypes = {
    history: PropTypes.object,
    toggleRefreshGridData: PropTypes.func,
};

TitleMetadataView.defaultProps = {
    history: {},
    toggleRefreshGridData: () => null,
};

export default connect(null, mapDispatchToProps)(TitleMetadataView);

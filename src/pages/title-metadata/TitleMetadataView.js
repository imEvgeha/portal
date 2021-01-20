import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {toggleRefreshGridData} from '@vubiquity-nexus/portal-ui/lib/grid/gridActions';
import {URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import {connect} from 'react-redux';
import TitleCreate from '../legacy/containers/metadata/dashboard/components/TitleCreateModal'; // replace with new component
import CatalogueOwner from './components/catalogue-owner/CatalogueOwner';
import TitleMetadataHeader from './components/title-metadata-header/TitleMetadataHeader';
import TitleMetadataTable from './components/title-metadata-table/TitleMetadataTable';
import {CREATE_NEW_TITLE, SYNC_LOG, DEFAULT_CATALOGUE_OWNER} from './constants';
import './TitleMetadataView.scss';

export const TitleMetadataView = ({history, toggleRefreshGridData}) => {
    const [showModal, setShowModal] = useState(false);
    const [catalogueOwner, setCatalogueOwner] = useState({
        tenantCode: DEFAULT_CATALOGUE_OWNER,
    });

    const closeModalAndRefreshTable = () => {
        setShowModal(false);
        toggleRefreshGridData(true);
    };

    const changeCatalogueOwner = owner => {
        setCatalogueOwner(prevState => {
            return {
                ...prevState,
                tenantCode: owner,
            };
        });
    };

    return (
        <div className="nexus-c-title-metadata">
            <TitleMetadataHeader>
                <CatalogueOwner setCatalogueOwner={changeCatalogueOwner} />
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
            <TitleMetadataTable history={history} catalogueOwner={catalogueOwner} />
            <TitleCreate
                display={showModal}
                toggle={closeModalAndRefreshTable}
                tenantCode={catalogueOwner.tenantCode}
            />
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

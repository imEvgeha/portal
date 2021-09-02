import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {SUCCESS_ICON} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-toast-notification/constants';
import {toggleRefreshGridData} from '@vubiquity-nexus/portal-ui/lib/grid/gridActions';
import {addToast} from '@vubiquity-nexus/portal-ui/lib/toast/toastActions';
import {URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import {connect} from 'react-redux';
import {store} from '../../index';
import TitleCreate from '../legacy/containers/metadata/dashboard/components/TitleCreateModal'; // replace with new component
import {resetTitle} from '../metadata/metadataActions';
import CatalogueOwner from './components/catalogue-owner/CatalogueOwner';
import TitleMetadataHeader from './components/title-metadata-header/TitleMetadataHeader';
import TitleMetadataTable from './components/title-metadata-table/TitleMetadataTable';
import {CREATE_NEW_TITLE, SYNC_LOG, DEFAULT_CATALOGUE_OWNER} from './constants';
import './TitleMetadataView.scss';

export const TitleMetadataView = ({history, toggleRefreshGridData, resetTitleId}) => {
    const [showModal, setShowModal] = useState(false);
    const [catalogueOwner, setCatalogueOwner] = useState({
        tenantCode: DEFAULT_CATALOGUE_OWNER,
    });

    useEffect(() => {
        resetTitleId();

        if (window.sessionStorage.getItem('unmerge')) {
            const successToast = {
                title: 'Success',
                icon: SUCCESS_ICON,
                isAutoDismiss: true,
                description: 'Title succesfully unmerged!',
            };

            window.sessionStorage.removeItem('unmerge');
            store.dispatch(addToast(successToast));
        }
    }, []);

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
                redirectToV2
            />
        </div>
    );
};

const mapDispatchToProps = dispatch => ({
    toggleRefreshGridData: payload => dispatch(toggleRefreshGridData(payload)),
    resetTitleId: () => dispatch(resetTitle()),
});

TitleMetadataView.propTypes = {
    history: PropTypes.object,
    toggleRefreshGridData: PropTypes.func,
    resetTitleId: PropTypes.func,
};

TitleMetadataView.defaultProps = {
    history: {},
    toggleRefreshGridData: () => null,
    resetTitleId: () => null,
};

export default connect(null, mapDispatchToProps)(TitleMetadataView);

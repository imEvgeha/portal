import React, {useEffect, useState} from 'react';
import NexusEntity from '@vubiquity-nexus/portal-ui/lib/elements/nexus-entity/NexusEntity';
import {NEXUS_ENTITY_TYPES} from '@vubiquity-nexus/portal-ui/src/elements/nexus-entity/constants';
import {TabMenu} from 'primereact/tabmenu';
import {useDispatch, useSelector} from 'react-redux';
import {fetchConfigApiEndpoints} from '../legacy/containers/settings/settingsActions';
import * as selectors from '../legacy/containers/settings/settingsSelectors';
import EndpointContainer from './enpoint-container/EndpointContainer';
import NexusDataPanel from './nexus-data-panel/NexusDataPanel';
import {SETTINGS_TABS} from './constants';
import './SettingsPage.scss';

const SettingsPage = () => {
    const dispatch = useDispatch();
    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedApi, setSelectedApi] = useState(undefined);
    const [configList, setConfigList] = useState([]);
    const fetchAPIConfigListResult = useSelector((state, props) =>
        selectors.createSettingsEndpointsSelector()(state, props)
    );

    useEffect(() => {
        dispatch(fetchConfigApiEndpoints());
    }, []);

    useEffect(() => {
        setConfigList(fetchAPIConfigListResult);
        setSelectedApi(fetchAPIConfigListResult[0]);
    }, [fetchAPIConfigListResult]);

    const configListItemTemplate = entry => (
        <div className="entry" onClick={() => onApiSelected(entry)}>
            <NexusEntity heading={<span>{entry.displayName}</span>} type={NEXUS_ENTITY_TYPES.default} />
        </div>
    );

    const onApiSelected = entry => {
        setSelectedApi(entry);
    };

    const settingsHeader = () => (
        <div className="header">
            <div className="row">
                <div className="col-4">
                    <h1>Settings</h1>
                </div>
                <div className="col-4 d-flex justify-content-center">
                    <TabMenu
                        className="nexus-c-title-metadata__tab-menu"
                        model={SETTINGS_TABS}
                        activeIndex={activeIndex}
                        onTabChange={e => setActiveIndex(e.index)}
                    />
                </div>
            </div>
        </div>
    );

    const headerTemplate = () => {
        return (
            <div>
                <NexusEntity heading={SETTINGS_TABS[activeIndex].listDisplayName} type={NEXUS_ENTITY_TYPES.subheader} />
            </div>
        );
    };

    const settingsPanels = () => (
        <div className="nexus-c-settings-content ">
            <div className="h-100">
                <div className="row w-100 h-100">
                    <div className="col-6 h-100">
                        <NexusDataPanel
                            header={headerTemplate()}
                            data={configList}
                            itemTemplate={configListItemTemplate}
                        />
                    </div>

                    <div className="col-6 h-100">{selectedApi && <EndpointContainer endpoint={selectedApi} />}</div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="nexus-c-settings-page nexus-c-page-container d-flex flex-column h-100">
            {/* <div className="page-contents position-relative"> */}
            {settingsHeader()}
            {settingsPanels()}
            {/* </div> */}
        </div>
    );
};

SettingsPage.propTypes = {};

SettingsPage.defaultProps = {};

export default SettingsPage;

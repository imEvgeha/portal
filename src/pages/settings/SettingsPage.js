import React, {useEffect, useRef, useState} from 'react';
import NexusEntity from '@vubiquity-nexus/portal-ui/lib/elements/nexus-entity/NexusEntity';
import {TabMenu} from 'primereact/tabmenu';
import {useDispatch, useSelector} from 'react-redux';
import {fetchConfigApiEndpoints} from '../legacy/containers/settings/settingsActions';
import * as selectors from '../legacy/containers/settings/settingsSelectors';
import NexusDataPanel from './nexus-data-panel/NexusDataPanel';
import {SETTINGS_TABS} from './constants';
import './SettingsPage.scss';

const SettingsPage = ({}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const ds = useRef(null);
    const [configList, setConfigList] = useState([]);
    const dispatch = useDispatch();
    const result = useSelector((state, props) => selectors.createSettingsEndpointsSelector()(state, props));

    useEffect(() => {
        dispatch(fetchConfigApiEndpoints());
    }, []);

    useEffect(() => {
        console.log(result);
        setConfigList(result);
    }, [result]);

    const configListItemTemplate = entry => (
        <div className="row mb-3">
            <div className="col-8">
                <span>{entry.displayName}</span>
            </div>
            <div className="col-4">
                <button>test</button>
            </div>
        </div>
    );

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
                <NexusEntity heading="test" />
            </div>
        );
    };

    const settingsPanels = () => (
        <div className="nexus-c-settings-content ">
            <div className="h-100">
                <div className="row h-100">
                    <div className="col-6 h-100">
                        <NexusDataPanel
                            header={headerTemplate()}
                            data={configList}
                            itemTemplate={configListItemTemplate}
                            footer="footer-------------------"
                        />
                    </div>

                    <div className="col-6 h-100">
                        <div>test</div>
                    </div>
                </div>
            </div>
        </div>

        // <div className="row mt-5">
        //     <div className="col-6">
        //         <div className="nexus-c-config-options-wrapper">
        //             {/*<DataScroller*/}
        //             {/*    ref={ds}*/}
        //             {/*    value={configList}*/}
        //             {/*    itemTemplate={configListItemTemplate}*/}
        //             {/*    rows={configList.length}*/}
        //             {/*    inline={true}*/}
        //             {/*    scrollHeight="100%"*/}
        //             {/*    header="Click Load Button at Footer to Load More"*/}
        //             {/*/>*/}
        //
        //             <NexusDataPanel
        //                 header="header"
        //                 data={configList}
        //                 itemTemplate={configListItemTemplate}
        //                 footer="footer-------------------"
        //             />
        //         </div>
        //     </div>
        // </div>
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

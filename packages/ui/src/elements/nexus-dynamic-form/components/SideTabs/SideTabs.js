import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import classnames from 'classnames';
import moment from 'moment';
import './SideTabs.scss';

const SideTabs = ({data, path, onChange, subTabs, isRemoved, clearIsRemoved}) => {
    const [currentTab, setCurrentTab] = useState({
        tabIndex: 0,
        subTabIndex: 0,
    });

    useEffect(() => {
        if (isRemoved) {
            setCurrentTab({
                tabIndex: 0,
                subTabIndex: 0,
            });
            clearIsRemoved();
        }
    }, [isRemoved]);

    const handleTabChanged = (key, tabIndex, subTabIndex = 0) => {
        const oldTab = currentTab.tabIndex;
        const oldSubTab = currentTab.subTabIndex;
        setCurrentTab({
            tabIndex,
            subTabIndex,
        });
        onChange(oldSubTab, oldTab, key, tabIndex, subTabIndex);
    };

    const checkSubTabValues = obj => {
        let toRender = false;
        subTabs.forEach(key => {
            if (obj[key]) toRender = true;
        });
        return toRender;
    };

    const getSubTabLabel = obj => {
        let value = '';
        subTabs.forEach(key => {
            if (obj[key]) value = value.concat(' ', obj[key]);
        });
        return value;
    };

    const renderSideSubTabs = (data, key, index) => {
        const toReturn = [];
        const masterTitle = data[key].find(e =>
            e?.tenantData?.complexProperties?.find(e =>
                e?.simpleProperties.find(e => e.name === 'hasGeneratedChildren')
            )
        );
        data[key].forEach((obj, subIndex) => {
            const duration = moment.duration(moment.utc(masterTitle?.updatedAt).diff(moment.utc(obj?.updatedAt)));
            const secs = Math.abs(duration.asSeconds());
            const isDecorated = secs < 5;
            const isRatings = path === 'ratings';
            const tenantDataAttributes = obj?.tenantData?.complexProperties?.find(e => e.name === 'auto-decorate');
            const isGeneratedValue = tenantDataAttributes?.simpleProperties?.find(e => e.name === 'isGenerated')?.value;

            if (checkSubTabValues(obj) && !obj.isDeleted) {
                toReturn.push(
                    <div
                        key={`${key}[${subIndex}]`}
                        className={classnames('nexus-c-side-tabs__subtab-container', {
                            'nexus-c-side-tabs__subtab-container--active':
                                currentTab.tabIndex === index && currentTab.subTabIndex === subIndex,
                            'nexus-c-side-tabs__subtab-container--open': currentTab.tabIndex === index,
                        })}
                    >
                        {isDecorated && isGeneratedValue && !isRatings && (
                            // <StatusLink className="tablinks__status-link" />
                            <i className="po po-linked" />
                        )}
                        <Button onClick={() => handleTabChanged(key, index, subIndex)}>{getSubTabLabel(obj)}</Button>
                    </div>
                );
            }
        });
        return toReturn;
    };

    const renderSideTabs = () => {
        return Object.keys(data).map((key, index) => {
            let toReturn = [];
            toReturn.push(
                <div key={key} className="nexus-c-side-tabs__tab-container">
                    <Button
                        className="nexus-c-side-tabs__tab-button"
                        onClick={() => handleTabChanged(key, index)}
                        iconAfter={<ChevronDownIcon label="Down icon" size="large" />}
                    >
                        {key}
                    </Button>
                </div>
            );
            const subTabsArray = renderSideSubTabs(data, key, index);
            if (data[key].length !== subTabsArray.length) {
                const missedTabIndex = data[key].findIndex(e => !checkSubTabValues(e));
                toReturn.splice(
                    0,
                    1,
                    <div
                        key={key}
                        className={classnames('nexus-c-side-tabs__tab-container', {
                            'nexus-c-side-tabs__tab-container--active':
                                currentTab.tabIndex === index && currentTab.subTabIndex === missedTabIndex,
                        })}
                    >
                        <Button
                            className="nexus-c-side-tabs__tab-button"
                            onClick={() => handleTabChanged(key, index, missedTabIndex)}
                            iconAfter={<ChevronDownIcon label="Down icon" size="large" />}
                        >
                            {key}
                        </Button>
                    </div>
                );
            }
            if (subTabsArray.length === 0) {
                toReturn.splice(
                    0,
                    1,
                    <div
                        key={key}
                        className={classnames('nexus-c-side-tabs__tab-container', {
                            'nexus-c-side-tabs__tab-container--active': currentTab.tabIndex === index,
                        })}
                    >
                        <Button onClick={() => handleTabChanged(key, index)}>{key}</Button>
                    </div>
                );
            } else {
                toReturn = toReturn.concat(subTabsArray);
            }
            return toReturn;
        });
    };

    return <div className="nexus-c-side-tabs">{renderSideTabs()}</div>;
};

SideTabs.propTypes = {
    data: PropTypes.object,
    path: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    subTabs: PropTypes.array,
    isRemoved: PropTypes.bool,
    clearIsRemoved: PropTypes.func.isRequired,
};

SideTabs.defaultProps = {
    data: {},
    subTabs: [],
    isRemoved: false,
};

export default SideTabs;

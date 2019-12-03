import React, {useState} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {DropdownItemGroup, DropdownItem} from '@atlaskit/dropdown-menu';
import {GlobalNav, GlobalItem} from '@atlaskit/navigation-next';
import Avatar from '@atlaskit/avatar';
import EditorMediaWrapLeftIcon from '@atlaskit/icon/glyph/editor/media-wrap-left';
import EditorSettingsIcon from '@atlaskit/icon/glyph/editor/settings';
import EditorSearchIcon from '@atlaskit/icon/glyph/editor/search';
import TrayIcon from '@atlaskit/icon/glyph/tray';
import GlobalItemWithDropdown from './elements/GlobalItemWithDropdown';
import NexusNavIcon from './elements/NexusNavIcon';
import {keycloak} from '../index';
import {AVAILS, METADATA, MEDIA, SETTINGS} from './constants';

const ItemComponent = ({dropdownItems: DropdownItems, ...itemProps}) => {
    if (DropdownItems) {
        return (
            <GlobalItemWithDropdown
                trigger={({isOpen}) => (
                    <GlobalItem isSelected={isOpen} {...itemProps} />
                )}
                items={<DropdownItems />}
            />
        );
    }
    return <GlobalItem {...itemProps} />;
};

const NexusNavigation = ({history, profileInfo}) => {
    const [selectedItem, setSelectedItem] = useState('');

    const handleClick = (destination) => {
        history.push(`/${destination}`);
        setSelectedItem(destination);
    };

    const AccountDropdownItems = () => (
        <DropdownItemGroup title={profileInfo.name || 'Profile'}>
            <DropdownItem onClick={keycloak.instance.logout}>
                Log out
            </DropdownItem>
        </DropdownItemGroup>
    );

    return (
        <GlobalNav
            itemComponent={ItemComponent}
            primaryItems={[
                {
                    component: () => <NexusNavIcon/>,
                    id: 'logo',
                },
                {
                    icon: TrayIcon,
                    id: AVAILS,
                    tooltip: AVAILS,
                    isSelected: (selectedItem === AVAILS),
                    onClick: () => handleClick(AVAILS),
                },
                {
                    icon: EditorMediaWrapLeftIcon,
                    id: METADATA,
                    tooltip: METADATA,
                    isSelected: (selectedItem === METADATA),
                    onClick: () => handleClick(METADATA),
                },
                {
                    icon: EditorSearchIcon,
                    id: MEDIA,
                    tooltip: 'Media Search',
                    isSelected: (selectedItem === MEDIA),
                    onClick: () => handleClick(MEDIA),
                },
            ]}
            secondaryItems={[
                {
                    icon: EditorSettingsIcon,
                    id: SETTINGS,
                    tooltip: SETTINGS,
                    isSelected: (selectedItem === SETTINGS),
                    onClick: () => handleClick(SETTINGS),
                },
                {
                    // eslint-disable-next-line react/prop-types
                    component: ({onClick}) => (
                        <Avatar
                            borderColor="transparent"
                            size="medium"
                            name={profileInfo.name}
                            onClick={onClick}
                        />
                    ),
                    dropdownItems: AccountDropdownItems,
                    id: 'profile',
                    icon: null,
                },
            ]}
        />
    );
};

NexusNavigation.propTypes = {
    profileInfo: PropTypes.any,
    history: PropTypes.object,
};

NexusNavigation.defaultProps = {
    profileInfo: {},
};

const mapStateToProps = state => {
    return {
        profileInfo: state.root.profileInfo
    };
};

export default withRouter(connect(mapStateToProps, null)(NexusNavigation));



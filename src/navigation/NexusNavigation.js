import React, {useEffect, useState} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {DropdownItemGroup, DropdownItem} from '@atlaskit/dropdown-menu';
import {GlobalNav, GlobalItem, ThemeProvider, modeGenerator} from '@atlaskit/navigation-next';
import Avatar from '@atlaskit/avatar';
import EditorSettingsIcon from '@atlaskit/icon/glyph/editor/settings';
import {colors} from '@atlaskit/theme';
import GlobalItemWithDropdown from './components/GlobalItemWithDropdown';
import {navigationPrimaryItems} from './components/NavigationItems';
import {keycloak} from '../index';
import {SETTINGS} from './constants';


const customThemeMode = modeGenerator({
    product: {
        text: colors.N0,
        background: '#424242',
    },
});

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

    useEffect(() => setSelectedItem(history.location.pathname.split('/')[1]), []);

    const handleClick = (destination) => {
        history.push(`/${destination.toLowerCase()}`);
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
        <ThemeProvider theme={theme => ({
            ...theme,
            mode: customThemeMode
        })}>
            <GlobalNav
                itemComponent={ItemComponent}
                primaryItems={navigationPrimaryItems(selectedItem, handleClick)}
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
        </ThemeProvider>
    );
};

NexusNavigation.propTypes = {
    profileInfo: PropTypes.object,
    history: PropTypes.object,
};

NexusNavigation.defaultProps = {
    profileInfo: {},
    history: {location: {pathname: ''}},
};

const mapStateToProps = state => {
    return {
        profileInfo: state.root.profileInfo
    };
};

export default withRouter(connect(mapStateToProps, null)(NexusNavigation));



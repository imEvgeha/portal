import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Avatar from '@atlaskit/avatar';
import {DropdownItemGroup, DropdownItem} from '@atlaskit/dropdown-menu';
import EditorSettingsIcon from '@atlaskit/icon/glyph/editor/settings';
import {GlobalNav, GlobalItem, ThemeProvider, modeGenerator} from '@atlaskit/navigation-next';
import {colors} from '@atlaskit/theme';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Can, idToAbilityNameMap} from '../../../ability';
import {logout} from '../../../auth/authActions';
import {searchFormShowSearchResults} from '../../../pages/legacy/stores/actions/avail/dashboard';
import GlobalItemWithDropdown from './components/GlobalItemWithDropdown';
import {navigationPrimaryItems} from './components/NavigationItems';
import {SETTINGS, backgroundColor} from './constants';

const customThemeMode = modeGenerator({
    product: {
        text: colors.N0,
        background: backgroundColor,
    },
});

const ItemComponent = ({dropdownItems: DropdownItems, ...itemProps}) => {
    const {id} = itemProps;
    const abilityLocationName = idToAbilityNameMap[id];

    if (DropdownItems) {
        const ItemWithDropdown = () => {
        return (
            <GlobalItemWithDropdown
                trigger={({isOpen}) => (
                    <GlobalItem isSelected={isOpen} {...itemProps} />
                )}
                items={<DropdownItems />}
            />
        );
};
        return (
            abilityLocationName
                ? (
                    <Can do="read" on={abilityLocationName}>
                        <ItemWithDropdown />
                    </Can>
                )
                : <ItemWithDropdown />
        );
    }
    return (
        abilityLocationName
            ? (
                <Can do="read" on={abilityLocationName}>
                    <GlobalItem {...itemProps} />
                </Can>
            )
            : <GlobalItem {...itemProps} />
    );
};

const NexusNavigation = ({history, location, profileInfo, logout}) => {
    const [selectedItem, setSelectedItem] = useState('');

    useEffect(() => setSelectedItem(location.pathname.split('/')[1]), []);

    const handleClick = (destination) => {
        history.push(`/${destination.toLowerCase()}`);
        setSelectedItem(destination);
    };

    const AccountDropdownItems = () => {
        return (
            <DropdownItemGroup title={profileInfo.username || 'Profile'}>
                <DropdownItem onClick={logout}>
                    Log out
                </DropdownItem>
            </DropdownItemGroup>
        );
    };

    return (
        <ThemeProvider theme={theme => ({
            ...theme,
            mode: customThemeMode
        })}
        >
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
                        component: ({onClick}) => {
                            return (
                                <Avatar
                                    borderColor="transparent"
                                    size="medium"
                                    name={profileInfo.username}
                                    onClick={onClick}
                                />
                            );
                        },
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
    logout: PropTypes.func,
};

NexusNavigation.defaultProps = {
    profileInfo: {},
    history: {location: {pathname: ''}},
    logout: () => null,
};

const mapStateToProps = ({auth}) => {
    const {userAccount} = auth || {};
    return {
        profileInfo: userAccount
    };
};

const mapDispatchToProps = dispatch => ({
    logout: payload => dispatch(logout(payload)),
});

export const gotoAvailsDashboard = () => {
    store.dispatch(searchFormShowSearchResults(false));
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NexusNavigation));

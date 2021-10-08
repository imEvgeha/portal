import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Avatar from '@atlaskit/avatar';
import {DropdownItemGroup, DropdownItem} from '@atlaskit/dropdown-menu';
import EditorSettingsIcon from '@atlaskit/icon/glyph/editor/settings';
import FeedbackIcon from '@atlaskit/icon/glyph/feedback';
import {GlobalNav, GlobalItem, ThemeProvider, modeGenerator} from '@atlaskit/navigation-next';
import {colors} from '@atlaskit/theme';
import {logout} from '@vubiquity-nexus/portal-auth/authActions';
import {URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import {Can, idToAbilityNameMap} from '@vubiquity-nexus/portal-utils/lib/ability';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import NexusFeedback from '../nexus-feedback/NexusFeedback';
import {NexusModalContext} from '../nexus-modal/NexusModal';
import GlobalItemWithDropdown from './components/GlobalItemWithDropdown';
import {ComponentWrapper, navigationPrimaryItems} from './components/NavigationItems';
import {SETTINGS, FEEDBACK_HEADER, backgroundColor} from './constants';

const customThemeMode = modeGenerator({
    product: {
        text: colors.N0,
        background: backgroundColor,
    },
});

// eslint-disable-next-line react/prop-types
const ItemComponent = ({dropdownItems: DropdownItems, ...itemProps}) => {
    const {id} = itemProps;
    const abilityLocationName = idToAbilityNameMap[id];

    if (DropdownItems) {
        const ItemWithDropdown = () => {
            return (
                <GlobalItemWithDropdown
                    trigger={({isOpen}) => <GlobalItem isSelected={isOpen} {...itemProps} />}
                    items={<DropdownItems />}
                />
            );
        };
        return abilityLocationName ? (
            <Can do="read" on={abilityLocationName}>
                <ItemWithDropdown />
            </Can>
        ) : (
            <ItemWithDropdown />
        );
    }
    return abilityLocationName ? (
        <Can do="read" on={abilityLocationName}>
            <GlobalItem {...itemProps} />
        </Can>
    ) : (
        <GlobalItem {...itemProps} />
    );
};

const NexusNavigation = ({history, location, profileInfo, logout}) => {
    const [selectedItem, setSelectedItem] = useState('');
    const {openModal, closeModal} = useContext(NexusModalContext);

    useEffect(() => setSelectedItem(location.pathname.split('/')[1]), [location.pathname]);

    const handleClick = destination => {
        history.push(`/${destination.toLowerCase()}`);
        setSelectedItem(destination);
    };

    const AccountDropdownItems = () => {
        return (
            <DropdownItemGroup title={profileInfo.username || 'Profile'}>
                <DropdownItem onClick={logout}>Log out</DropdownItem>
            </DropdownItemGroup>
        );
    };

    return (
        <ThemeProvider
            theme={theme => ({
                ...theme,
                mode: customThemeMode,
            })}
        >
            <GlobalNav
                itemComponent={ItemComponent}
                primaryItems={navigationPrimaryItems(selectedItem, handleClick)}
                secondaryItems={[
                    // TODO: remove URL.isLocalOrDev() once backend is intergated
                    ...(URL.isLocalOrDev()
                        ? [
                              {
                                  icon: FeedbackIcon,
                                  id: 'Feedback',
                                  tooltip: 'Feedback',
                                  onClick: () =>
                                      openModal(<NexusFeedback currentPage={selectedItem} closeModal={closeModal} />, {
                                          title: FEEDBACK_HEADER,
                                      }),
                              },
                          ]
                        : []),
                    {
                        icon: EditorSettingsIcon,
                        component: () => (
                            <ComponentWrapper handleClick={() => handleClick(SETTINGS)} link={SETTINGS}>
                                {' '}
                                <EditorSettingsIcon />{' '}
                            </ComponentWrapper>
                        ),
                        id: SETTINGS,
                        tooltip: SETTINGS,
                        isSelected: selectedItem === SETTINGS,
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
    location: PropTypes.object,
    logout: PropTypes.func,
};

NexusNavigation.defaultProps = {
    profileInfo: {},
    history: {location: {pathname: ''}},
    location: {pathname: ''},
    logout: () => null,
};

const mapStateToProps = ({auth}) => {
    const {userAccount} = auth || {};
    return {
        profileInfo: userAccount,
    };
};

const mapDispatchToProps = dispatch => ({
    logout: payload => dispatch(logout(payload)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NexusNavigation));

import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Avatar from '@atlaskit/avatar';
import {DropdownItem, DropdownItemGroup} from '@atlaskit/dropdown-menu';
import EditorSettingsIcon from '@atlaskit/icon/glyph/editor/settings';
import FeedbackIcon from '@atlaskit/icon/glyph/feedback';
import {GlobalItem, GlobalNav, modeGenerator, ThemeProvider} from '@atlaskit/navigation-next';
import {colors} from '@atlaskit/theme';
import {logout} from '@vubiquity-nexus/portal-auth/authActions';
import Restricted from '@vubiquity-nexus/portal-auth/lib/permissions/Restricted';
import {URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import {connect} from 'react-redux';
import {useLocation, useNavigate} from 'react-router-dom';
import NexusFeedback from '../nexus-feedback/NexusFeedback';
import {NexusModalContext} from '../nexus-modal/NexusModal';
import GlobalItemWithDropdown from './components/GlobalItemWithDropdown';
import {ComponentWrapper, navigationPrimaryItems} from './components/NavigationItems';
import {backgroundColor, FEEDBACK_HEADER, SETTINGS} from './constants';

const customThemeMode = modeGenerator({
    product: {
        text: colors.N0,
        background: backgroundColor,
    },
});

// eslint-disable-next-line react/prop-types
const ItemComponent = ({dropdownItems: DropdownItems, ...itemProps}) => {
    const Child = () =>
        DropdownItems ? (
            <GlobalItemWithDropdown
                trigger={({isOpen}) => <GlobalItem isSelected={isOpen} {...itemProps} />}
                items={<DropdownItems />}
            />
        ) : (
            <GlobalItem {...itemProps} />
        );

    return (
        <Restricted roles={itemProps.roles}>
            <Child />
        </Restricted>
    );
};

const NexusNavigation = ({profileInfo, logout}) => {
    const [selectedItem, setSelectedItem] = useState('');
    const {openModal, closeModal} = useContext(NexusModalContext);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => setSelectedItem(location.pathname.split('/')[1]), [location.pathname]);

    const handleClick = destination => {
        navigate(`${destination.toLowerCase()}`);
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
                                <EditorSettingsIcon />
                            </ComponentWrapper>
                        ),
                        id: SETTINGS,
                        tooltip: SETTINGS,
                        isSelected: selectedItem === SETTINGS,
                        onClick: () => handleClick(SETTINGS),
                        roles: {
                            operation: 'OR',
                            values: ['configuration_viewer', 'configuration_user', 'configuration_admin'],
                        },
                    },

                    {
                        icon: 'pi pi-sliders-h',
                        component: () => (
                            <ComponentWrapper handleClick={() => handleClick('settings/v2')} link="settings/v2">
                                <i className="pi pi-sliders-h" />
                            </ComponentWrapper>
                        ),
                        id: 'settings/v2',
                        tooltip: 'Settings V2',
                        isSelected: selectedItem === 'settings/v2',
                        onClick: () => handleClick('settings/v2'),
                        roles: {
                            operation: 'OR',
                            values: ['configuration_viewer', 'configuration_user', 'configuration_admin'],
                        },
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
    logout: PropTypes.func,
};

NexusNavigation.defaultProps = {
    profileInfo: {},
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

export default connect(mapStateToProps, mapDispatchToProps)(NexusNavigation);

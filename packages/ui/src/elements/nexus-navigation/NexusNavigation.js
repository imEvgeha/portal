import React, {useContext, useEffect, useState} from 'react';
import EditorSettingsIcon from '@atlaskit/icon/glyph/editor/settings';
import FeedbackIcon from '@atlaskit/icon/glyph/feedback';
import {GlobalItem, GlobalNav, modeGenerator, ThemeProvider} from '@atlaskit/navigation-next';
import {colors} from '@atlaskit/theme';
import {Restricted} from '@portal/portal-auth/permissions';
import {URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import {useLocation, useNavigate} from 'react-router-dom';
import NexusFeedback from '../nexus-feedback/NexusFeedback';
import {NexusModalContext} from '../nexus-modal/NexusModal';
import {ComponentWrapper, navigationPrimaryItems} from './components/NavigationItems';
import NexusUser from './nexus-user/NexusUser';
import {backgroundColor, FEEDBACK_HEADER, SETTINGS, USER_AVATAR} from './constants';

const customThemeMode = modeGenerator({
    product: {
        text: colors.N0,
        background: backgroundColor,
    },
});

// eslint-disable-next-line react/prop-types
const ItemComponent = ({dropdownItems: DropdownItems, ...itemProps}) => {
    return (
        <Restricted resource={itemProps.resource}>
            <GlobalItem {...itemProps} />
        </Restricted>
    );
};

const NexusNavigation = () => {
    const [selectedItem, setSelectedItem] = useState('');
    const {openModal, closeModal} = useContext(NexusModalContext);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => setSelectedItem(location.pathname.split('/')[1]), [location.pathname]);

    const handleClick = destination => {
        navigate(`${destination.toLowerCase()}`);
        setSelectedItem(destination);
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
                        icon: 'pi pi-sliders-h',
                        component: () => (
                            <ComponentWrapper handleClick={() => handleClick('settings')} link="settings">
                                <i className="pi pi-sliders-h" />
                            </ComponentWrapper>
                        ),
                        id: 'settings',
                        tooltip: 'Settings',
                        isSelected: selectedItem === 'settings',
                        onClick: () => handleClick('settings'),
                        resource: 'settingsMenuIcon',
                    },

                    {
                        component: () => {
                            return <NexusUser />;
                        },
                        id: 'profile',
                        icon: null,
                        tooltip: USER_AVATAR,
                    },
                ]}
            />
        </ThemeProvider>
    );
};

export default NexusNavigation;

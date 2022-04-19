import React, {useContext, useEffect, useRef, useState} from 'react';
import EditorSettingsIcon from '@atlaskit/icon/glyph/editor/settings';
import FeedbackIcon from '@atlaskit/icon/glyph/feedback';
import {GlobalItem, GlobalNav, modeGenerator, ThemeProvider} from '@atlaskit/navigation-next';
import {colors} from '@atlaskit/theme';
import {URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import {Can, can, idToAbilityNameMap} from '@vubiquity-nexus/portal-utils/lib/ability';
import {Avatar} from 'primereact/avatar';
import {OverlayPanel} from 'primereact/overlaypanel';
import {useNavigate, useLocation} from 'react-router-dom';
import NexusFeedback from '../nexus-feedback/NexusFeedback';
import {NexusModalContext} from '../nexus-modal/NexusModal';
import GlobalItemWithDropdown from './components/GlobalItemWithDropdown';
import {ComponentWrapper, navigationPrimaryItems} from './components/NavigationItems';
import NexusUserAvatar from './nexus-user-avatar/NexusUserAvatar';
import {backgroundColor, FEEDBACK_HEADER, SETTINGS} from './constants';

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

const NexusNavigation = () => {
    const [selectedItem, setSelectedItem] = useState('');
    const op = useRef(null);
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

                    ...(can('read', 'ConfigUI')
                        ? [
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
                          ]
                        : []),

                    ...(can('read', 'ConfigUI')
                        ? [
                              {
                                  icon: 'pi pi-sliders-h',
                                  component: () => (
                                      <ComponentWrapper
                                          handleClick={() => handleClick('settings/v2')}
                                          link="settings/v2"
                                      >
                                          <i className="pi pi-sliders-h" />
                                      </ComponentWrapper>
                                  ),
                                  id: 'settings/v2',
                                  tooltip: 'Settings V2',
                                  isSelected: selectedItem === 'settings/v2',
                                  onClick: () => handleClick('settings/v2'),
                              },
                          ]
                        : []),
                    {
                        component: () => {
                            return (
                                <div>
                                    <Avatar
                                        icon="pi pi-user"
                                        size="large"
                                        className="mr-2 nav-user"
                                        onClick={e => op.current.toggle(e)}
                                    />

                                    <OverlayPanel ref={op}>
                                        <NexusUserAvatar />
                                    </OverlayPanel>
                                </div>
                            );
                        },
                        id: 'profile',
                        icon: null,
                    },
                ]}
            />
        </ThemeProvider>
    );
};

export default NexusNavigation;

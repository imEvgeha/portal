import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {GlobalNav, GlobalItem, GlobalNavigationSkeleton, ThemeProvider} from '@atlaskit/navigation-next';
import Avatar from '@atlaskit/avatar';
import TrayIcon from '@atlaskit/icon/glyph/tray';

// const mapStateToProps = state => {
//     return {
//         profileInfo: state.root.profileInfo
//     };
// };


const NavbarConnect = () => {
    return (
        <GlobalNav
            itemComponent={GlobalItem}
            primaryItems={[
                {
                    icon: TrayIcon,
                    id: 'avails',
                    tooltip: 'Avails',
                    onClick: () => console.log('bravo care')
                },
                {
                    icon: TrayIcon,
                    id: 'metadata',
                    tooltip: 'Metadata',
                    onClick: () => console.log('bravo care')
                },
                {
                    icon: TrayIcon,
                    id: 'media-search',
                    tooltip: 'Media Search',
                    onClick: () => console.log('bravo care')
                },
            ]}
            secondaryItems={[
                {
                    icon: TrayIcon,
                    id: 'settings',
                    tooltip: 'Settings',
                    onClick: () => console.log('brt')
                },
                {
                    component: () => (
                        <Avatar
                            borderColor="transparent"
                            isActive={false}
                            isHover={false}
                            size="medium"
                            onClick={() => console.log('too kralju!')}
                        />
                    )
                },
            ]}
        />
    );
};

NavbarConnect.propTypes = {
    profileInfo: PropTypes.any,
};

// const options = {pure: false};
// const Navbar = connect(mapStateToProps, null, null, options)(NavbarConnect);

export default NavbarConnect;


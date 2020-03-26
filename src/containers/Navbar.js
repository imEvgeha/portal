import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import jwtDecode from 'jwt-decode';
import {NavLink} from 'react-router-dom';
import BlockUi from 'react-block-ui'; // replace it
import FontAwesome from 'react-fontawesome'; // replace it
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap'; // replace it
import 'react-block-ui/style.css'; // remove it
import {Loader} from 'react-loaders'; // replace it
import {
    searchFormShowSearchResults,
} from '../stores/actions/avail/dashboard';
import {Can} from '../ability';
import NexusBreadcrumb from './NexusBreadcrumb';
import {AVAILS_DASHBOARD} from '../constants/breadcrumb';
import {logout} from '../auth/authActions';
import {keycloak} from '../index';
import {removeAccessToken, removeRefreshToken} from '../auth/authService';

const NavbarConnect = ({searchFormShowSearchResults, profileInfo, blocking, token, logout}) => {
    const [isDropDownOpen, setIsDropDownOpen] = useState(false);
    const [roles, setRoles] = useState([]);
    useEffect(() => {
        const userRoles = token ? jwtDecode(token).resource_access.account.roles : [];
        setRoles(userRoles);
    }, [token]);
    const gotoAvailsDashboard = () => {
        searchFormShowSearchResults(false);
        NexusBreadcrumb.set(AVAILS_DASHBOARD);
    };

    return (
        <BlockUi tag="div" blocking={blocking} loader={<Loader />}>
            <nav className="navbar navbar-NEXUS navbar-expand-md">
                <span className="navbar-brand">
                    <a className="navbar-brand Nlogo" href="#"> </a>
                </span>
                <ul className="navbar-nav">
                    <Can I="read" a="Avail">
                        <li className="nav-item">
                            <span className="nav-link" href="#" onClick={gotoAvailsDashboard}>
                                <NavLink activeClassName="navActive" to="/avails" id="avail-tab">Avails</NavLink>
                            </span>
                        </li>
                    </Can>
                    <Can I="read" a="Metadata">
                        <li className="">
                            <span className="nav-link" href="#">
                                <NavLink activeClassName="navActive" to="/metadata" id="metadata-tab">Metadata</NavLink>
                            </span>
                        </li>
                    </Can>
                    <Can I="read" a="AssetManagement">
                        <li className="nav-item">
                            <span className="nav-link" href="#">
                                <NavLink activeClassName="navActive" to="/media" id="metadata-tab">Media Search</NavLink>
                            </span>
                        </li>
                    </Can>
                </ul>
                <ul className="nav navbar-nav ml-auto">
                    <Dropdown 
                        isOpen={isDropDownOpen} 
                        toggle={() => setIsDropDownOpen(!isDropDownOpen)}
                        inNavbar={true} 
                        nav={true}
                    >
                        <DropdownToggle caret nav={true} id="navbar-dropdown-btn">
                            <FontAwesome name='user-circle' style={{marginRight: '5px'}} />
                            {profileInfo.name}
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem header>
                                {roles.includes('user') && roles.includes('manage') ? 'user, manage' : ''}
                                {roles.includes('user') && !roles.includes('manage') ? 'user' : ''}
                                {!roles.includes('user') && roles.includes('manage') ? 'user' : ''}
                            </DropdownItem>
                            <DropdownItem>
                                <NavLink id="settings-link" to="/settings">
                                    <FontAwesome name='cog' style={{marginRight: '5px'}} />
                                    settings
                                </NavLink>
                            </DropdownItem>
                            <DropdownItem divider />
                            <DropdownItem onClick={logout}>
                                <span id="logout-btn">
                                    <FontAwesome name='sign-out-alt' style={{marginRight: '5px'}} />
                                    logout
                                </span>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </ul>
            </nav>
        </BlockUi>
    );
};

NavbarConnect.propTypes = {
    searchFormShowSearchResults: PropTypes.func,
    profileInfo: PropTypes.object,
    blocking: PropTypes.bool,
    token: PropTypes.string,
    logout: PropTypes.func,
};

NavbarConnect.defaultProps = {
    searchFormShowSearchResults: null,
    profileInfo: {},
    blocking: false,
    token: null,
    logout: () => null,
};

const mapStateToProps = state => {
    return {
        blocking: state.root.blocking,
        profileInfo: state.auth.profileInfo,
        token: state.auth.accessToken,
    };
};

const mapDispatchToProps = {
    searchFormShowSearchResults,
    logout,
};

const options = {pure: false};

export default connect(mapStateToProps, mapDispatchToProps, null, options)(NavbarConnect);


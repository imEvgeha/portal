import React from 'react';
import {connect} from 'react-redux';
import {keycloak} from '../index';
import {NavLink} from 'react-router-dom';
import FontAwesome from 'react-fontawesome';
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import t from 'prop-types';

const mapStateToProps = state => {
    return {profileInfo: state.root.profileInfo};
};

class NavbarConnect extends React.Component {
    static propTypes = {
        profileInfo: t.any,
    };

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            dropdownOpen: false
        };
    }

    toggle() {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }

    render() {
        return (
            <nav className="navbar navbar-NEXUS navbar-expand-md">
                <span className="navbar-brand">
                    <a className="navbar-brand Nlogo" href="#"> </a>
                </span>
                <ul className="navbar-nav">
                    <li className="">
                        <span className="nav-link" href="#">
                            <NavLink activeClassName="navActive" to="/dashboard"  id="dashboard-tab">Avails Dashboard</NavLink>
                        </span>
                    </li>
                    <li className="nav-item">
                        <span className="nav-link" href="#">
                            <NavLink activeClassName="navActive" to="/upload" id="upload-avails-tab">Upload Avails</NavLink>
                        </span>
                    </li>
                    <li className="nav-item">
                        <span className="nav-link" href="#">
                            <NavLink activeClassName="navActive" to="/registry" id="title-registry-tab">Title Registry</NavLink>
                        </span>
                    </li>
                    <li className="nav-item">
                        <span className="nav-link" href="#">
                            <NavLink activeClassName="navActive" to="/services" id="profile-services-tab">Profile Services</NavLink>
                        </span>
                    </li>
                    <li className="nav-item">
                        <span className="nav-link" href="#">
                            <NavLink activeClassName="navActive" to="/admin" id="admin-tab">Admin</NavLink>
                        </span>
                    </li>
                </ul>
                <ul className="nav navbar-nav ml-auto">
                    <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}
                        inNavbar={true} nav={true}>
                        <DropdownToggle caret nav={true} id="navbar-dropdown-btn">
                            <FontAwesome name='user-circle' style={{marginRight: '5px'}}/>
                            {this.props.profileInfo.name}
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem header>
                                {keycloak.hasResourceRole('user') && keycloak.hasResourceRole(
                                    'manage') ? 'user, manage' : ''}
                                {keycloak.hasResourceRole('user')
                  && !keycloak.hasResourceRole(
                      'manage') ? 'user' : ''}
                                {!keycloak.hasResourceRole('user')
                  && keycloak.hasResourceRole(
                      'manage') ? 'user' : ''}
                            </DropdownItem>
                            <DropdownItem divider/>
                            <DropdownItem disabled>Action</DropdownItem>
                            <DropdownItem>Another Action</DropdownItem>
                            <DropdownItem divider/>
                            <DropdownItem>
                                <a href="#" onClick={keycloak.logout} id="logout-btn"><FontAwesome name='sign-out-alt' style={{marginRight: '5px'}}/>logout</a>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </ul>
            </nav>
        );
    }
}
const options = {pure: false};

const Navbar = connect(mapStateToProps, null, null, options)(NavbarConnect);

export default Navbar;
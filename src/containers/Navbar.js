import React from 'react';
import {connect} from 'react-redux';
import {keycloak} from '../index';
import {NavLink} from 'react-router-dom';
import FontAwesome from 'react-fontawesome';
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import t from 'prop-types';
import {
    searchFormShowAdvancedSearch,
    searchFormShowSearchResults,
} from '../actions/dashboard';
import {Can} from '../ability';

const mapStateToProps = state => {
    return {profileInfo: state.root.profileInfo};
};

const mapDispatchToProps = {
    searchFormShowAdvancedSearch,
    searchFormShowSearchResults
};

class NavbarConnect extends React.Component {
    static propTypes = {
        searchFormShowAdvancedSearch: t.func,
        searchFormShowSearchResults: t.func,
        profileInfo: t.any,
    };

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.handleBackToDashboard = this.handleBackToDashboard.bind(this);
        this.state = {
            dropdownOpen: false
        };
    }

    toggle() {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }

    handleBackToDashboard() {
        this.props.searchFormShowAdvancedSearch(false);
        this.props.searchFormShowSearchResults(false);
    }

    goToHistoryContainer() {
    }

    render() {
        return (
            <nav className="navbar navbar-NEXUS navbar-expand-md">
                <span className="navbar-brand">
                    <a className="navbar-brand Nlogo" href="#"> </a>
                </span>
                <ul className="navbar-nav">
                    <Can I="read" a="Avail">
                        <li className="nav-item">
                            <span className="nav-link" href="#" onClick={this.handleBackToDashboard}>
                                <NavLink activeClassName="navActive" to="/dashboard"  id="dashboard-tab">Dashboard</NavLink>
                            </span>
                        </li>
                    </Can>
                    <Can I="read" a="Avail">
                        <li className="nav-item">
                            <span className="nav-link" href="#" onClick={this.goToHistoryContainer}>
                                <NavLink activeClassName="navActive" to="/avail-ingest-history" id="avail-ingest-history-tab">Avail Ingest History</NavLink>
                            </span>
                        </li>
                    </Can>

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
                                {keycloak.instance.hasResourceRole('user') && keycloak.hasResourceRole(
                                    'manage') ? 'user, manage' : ''}
                                {keycloak.instance.hasResourceRole('user')
                  && !keycloak.instance.hasResourceRole(
                      'manage') ? 'user' : ''}
                                {!keycloak.instance.hasResourceRole('user')
                  && keycloak.instance.hasResourceRole(
                      'manage') ? 'user' : ''}
                            </DropdownItem>
                            <DropdownItem divider/>
                            <DropdownItem>
                                <a href="#" onClick={keycloak.instance.logout} id="logout-btn"><FontAwesome name='sign-out-alt' style={{marginRight: '5px'}}/>logout</a>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </ul>
            </nav>
        );
    }
}
const options = {pure: false};

const Navbar = connect(mapStateToProps, mapDispatchToProps, null, options)(NavbarConnect);

export default Navbar;
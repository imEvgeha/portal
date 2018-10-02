import React from 'react';
import {connect} from 'react-redux';
import {keycloak} from '../index'
import {Link} from "react-router-dom";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

const mapStateToProps = state => {
  return {profileInfo: state.profileInfo};
};

class NavbarConnect extends React.Component {
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
        <nav className="navbar navbar-NEXUS navbar-expand-sm">
      <span className="navbar-brand">
        <a className="navbar-brand Nlogo" href="#"> </a>
      </span>

          <ul className="navbar-nav">
            <li className="">
          <span className="nav-link" href="#"><Link
              to="/cars">NavLinks</Link></span>
            </li>
            <li className="nav-item">
          <span className="nav-link" href="#"><Link
              to="/cars">NavLinks</Link></span>
            </li>
            <li className="nav-item">
          <span className="nav-link" href="#">
            <Link to="/cars" className="navActive">cars</Link>
          </span>
            </li>
            <li className="nav-item">
          <span className="nav-link" href="#"><Link
              to="/boats">boats</Link></span>
            </li>
          </ul>
          <ul className="nav navbar-nav ml-auto">
            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}
                      inNavbar={true} nav={true}>
              <DropdownToggle caret nav={true}>
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
                <DropdownItem><a href="#" onClick={keycloak.logout}>logout</a></DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </ul>

        </nav>
    );
  }
}



const ConnectedList = ({profileInfo}) => (
    <nav className="navbar navbar-NEXUS navbar-expand-sm">
      <span className="navbar-brand">
        <a className="navbar-brand Nlogo" href="#"> </a>
      </span>

      <ul className="navbar-nav">
        <li className="">
          <span className="nav-link" href="#"><Link
              to="/cars">NavLinks</Link></span>
        </li>
        <li className="nav-item">
          <span className="nav-link" href="#"><Link
              to="/cars">NavLinks</Link></span>
        </li>
        <li className="nav-item">
          <span className="nav-link" href="#">
            <Link to="/cars" className="navActive">cars</Link>
          </span>
        </li>
        <li className="nav-item">
          <span className="nav-link" href="#"><Link
              to="/boats">boats</Link></span>
        </li>
      </ul>
      <ul className="nav navbar-nav ml-auto">
        <li>
          <NavbarDropdown/>
        </li>
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" href="#"
             id="navbarDropdownMenuLink" data-toggle="dropdown"
             aria-haspopup="true" aria-expanded="false">
              {profileInfo.name} &nbsp;
              (
              {keycloak.hasResourceRole('user') && keycloak.hasResourceRole(
                  'manage') ? 'user, manage' : ''}
              {keycloak.hasResourceRole('user') && !keycloak.hasResourceRole(
                  'manage') ? 'user' : ''}
              {!keycloak.hasResourceRole('user') && keycloak.hasResourceRole(
                  'manage') ? 'user' : ''}
              )
          </a>
          <div className="dropdown-menu"
               aria-labelledby="navbarDropdownMenuLink">
            <a className="dropdown-item" href="#">Action</a>
            <a className="dropdown-item" href="#">Another action</a>
            <a className="dropdown-item" href="#">Something else here</a>
            <a className="dropdown-item" href="#" onClick={keycloak.logout}>logout</a>
          </div>
        </li>
      </ul>

    </nav>
);

const Navbar = connect(mapStateToProps)(NavbarConnect);

export default Navbar;
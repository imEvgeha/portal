import React from 'react'

import {
  BrowserRouter as Router,
  Redirect,
  Route
} from 'react-router-dom';
import Navbar from './Navbar'
import DashboardContainer from './dashboard/DashboardContainer'

export default class App extends React.Component {

  render() {
    return (
        <Router>
          <div>
            <Navbar/>
            <div >
              <Route exact path="/" render={() => <Redirect to="/dashboard"/> }/>
              <Route path="/dashboard" component={DashboardContainer}/>
            </div>
          </div>
        </Router>
    );
  }
}

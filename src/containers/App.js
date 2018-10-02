import React from 'react'

import CarContainer from './car/CarContainer'
import BoatContainer from './boat/BoatContainer'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import Navbar from '../components/Navbar'

export default class App extends React.Component {

  render() {

    // console.log(Object.keys(Keycloak));
    return (
        <Router>
          <div>
            <Navbar/>
            <div className="container">
              <Route exact path="/" component={CarContainer}/>
              <Route path="/cars" component={CarContainer}/>
              <Route path="/boats" component={BoatContainer}/>
            </div>
          </div>
        </Router>
    );
  }
}

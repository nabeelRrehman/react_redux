import React, { Component } from 'react';
import { Route, Router } from 'react-router-dom';

import history from './History'
import Login from './screens/Login/login';
import SignUp from './screens/SignUp/signup';
import home from './components/home';
import Role from './components/EventCard/Role/role';
import Details from './components/EventCard/Details/details';
import Buy from './components/addEvent/Buy/buy';
import  NavBarSide  from './components/sideNav/sidenav';


class Routers extends Component {

    render() {
        return (
            <Router history={history}>
                <div>
                    <Route exact path="/" component={Login} />
                    <Route exact path="/signup" component={SignUp} />
                    <Route path='/home' component={home} />
                    <Route path='/role' component={Role} />
                    <Route path='/details/:id' component={Details} />
                    <Route path='/buy/:ticket' component={Buy} />
                    <Route path='/sideBar' component={NavBarSide} />
                </div>
            </Router>
        )
    }
}

export default Routers;
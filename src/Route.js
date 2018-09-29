import React, { Component } from 'react';
import { Route, Router } from 'react-router-dom';

import history from './History'
import Login from './screens/Login/login';
import SignUp from './screens/SignUp/signup';
import home from './components/home';

class Routers extends Component {
    constructor() {
        super()
    }
    render() {
        return (
            <Router history={history}>
                <div>
                    <Route exact path="/" component={Login} />
                    <Route exact path="/signup" component={SignUp} />
                    <Route path = '/home' component = {home}/>
                </div>
            </Router>
        )
    }
}

export default Routers;
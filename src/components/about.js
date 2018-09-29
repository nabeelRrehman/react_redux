import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux'

class About extends Component {
    render() {
        return (
            <div>
                <h1>Hello About {this.props.name}</h1>
                <h2>{this.props.userName}</h2>
                <Link to='/'>Go to Home</Link>
            </div>
        )
    }
}

function mapStateToProps(state) {
    console.log(state)
    return({
        userName : state.rootReducer.userName,
        name : state.authReducer.name
    })
}

function mapDispatchToProps(dispatch){
    return({

    })
}

export default connect(mapStateToProps,mapDispatchToProps)(About);

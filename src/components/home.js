import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import {connect} from 'react-redux'
import './home.css'
import { changeState } from '../store/action/action'


class Home extends Component {
    constructor() {
        super() 

        this.state = {
            user : '',
            profile_pic : localStorage.getItem('profile_pic')
        }
    }

    componentWillMount() {
        const user = localStorage.getItem('user')       
        console.log(user)
        !user && 
        this.props.history.push('/')
    }  

    logout() {                          //logout the user and clear the localStorage
        localStorage.setItem('user','')
        this.props.history.push('/')
        localStorage.removeItem('profile_pic')
    }

    render() {
        // console.log(profile_pic)
        return (
            <div className = 'homepage'>
                <h1>Homepage</h1>
                <div className='profile_pic_div'><img className = {'profile_pic'} src = {this.props.profile_pic || localStorage.getItem('profile_pic')} /></div>
                <div>
                    <button onClick = {this.logout.bind(this)}>Logout</button>
                </div>
            </div>
        )
    }
}

//no used

function mapStateToProps(state) {
    return({
        profile_pic : state.rootReducer.profile_pic,
    })
}

function mapDispatchToProps(dispatch){
    return({
        chengeStateToReducer : (text)=>{
            dispatch(changeState(text))
        }
    })
}

export default connect(mapStateToProps,mapDispatchToProps)(Home);

// export default Home
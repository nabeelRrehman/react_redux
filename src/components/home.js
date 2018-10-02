import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import './home.css'
import { changeState } from '../store/action/action'
import Container from '../Container/container/container';
import firebase from 'firebase'
import Attendee from '../screens/Roles/Attendee/attendee';
import Organizer from '../screens/Roles/Organizer/organizer';
import swal from 'sweetalert2'
import AddEvent from './addEvent/addevent';


class Home extends Component {
    constructor() {
        super()

        this.state = {
            user: '',
            profile_pic: ''
        }
        this.logout = this.logout.bind(this)
    }

    componentWillMount() {
        const user = localStorage.getItem('user')
        console.log(user)

        !user && this.props.history.push('/')
    }

    componentDidMount() {
        const user = localStorage.getItem('user')
        const userUid = localStorage.getItem('userUid')
        // // console.log(userUid)
        user &&
            swal({
                onOpen: () => {
                    swal.showLoading()
                },
            })
            firebase.database().ref('users/' + userUid + '/userDetails/').once('child_added', (snapShot) => {
                console.log(snapShot.val())
                this.setState({ role: snapShot.val().role })
                swal({
                    showConfirmButton: false,
                    timer: 100
                })
            })
    }

    logout() {                          //logout the user and clear the localStorage
        localStorage.setItem('user', '')
        this.props.history.push('/')
        localStorage.removeItem('profile_pic')
        localStorage.removeItem('userUid')
    }

    render() {
        const { role } = this.state
        return (
            <Container logout={this.logout} profile_pic={this.props.profile_pic}>
                {role === 'attendee' && <Attendee />}
                {role === 'organizer' && <Organizer />}
            </Container>
        )
    }
}

//no used

function mapStateToProps(state) {
    return ({
        profile_pic: state.rootReducer.profile_pic,
    })
}

function mapDispatchToProps(dispatch) {
    return ({
        chengeStateToReducer: (text) => {
            dispatch(changeState(text))
        }
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);

// export default Home
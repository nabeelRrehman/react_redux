import React, { Component } from 'react';
import Container from '../../Container/container/container';
import firebase from 'firebase'
import swal from 'sweetalert2'

class UserBuyEvent extends Component {
    constructor() {
        super()

        this.state = {
        }
        this.logout = this.logout.bind(this)
    }

    componentWillMount() {
        const user = localStorage.getItem('userUid')
        !user && this.props.history.push('/')
        swal({
            onOpen: () => {
                swal.showLoading()
            },
        })
    }

    componentDidMount() {
        swal({
            showConfirmButton: false,
            timer: 100
        })
    }

    logout() {                          //logout the user and clear the localStorage
        localStorage.setItem('user', '')
        this.props.history.push('/')
        localStorage.removeItem('profile_pic')
        localStorage.removeItem('userUid')
    }

    render() {
        return (
            <Container logout={this.logout} profile_pic={this.props.profile_pic}>
            </Container>
        )
    }
}

export default UserBuyEvent

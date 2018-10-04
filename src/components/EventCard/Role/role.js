import React, { Component } from 'react';
import './role.css'
import Container from '../../../Container/container/container';
import firebase from 'firebase'
import swal from 'sweetalert2'

class Role extends Component {
    constructor() {
        super()

        this.state = {
            user: '',
            profile_pic: ''
        }
        this.logout = this.logout.bind(this)
        this.addRole = this.addRole.bind(this)
    }

    logout() {                          //logout the user and clear the localStorage
        localStorage.setItem('user', '')
        this.props.history.push('/')
        localStorage.removeItem('profile_pic')
        localStorage.removeItem('userUid')
    }

    addRole() {
        const user = localStorage.getItem('userUid')
        const { role } = this.state
        swal({
            onOpen: () => {
                swal.showLoading()
            },
        })
        const obj = {
            role,
            userUid : user
        }
        role && 
        firebase.database().ref('/users/'+user+'/userDetails/').push(obj)
        .then(()=>{
            swal({
                position: 'center',
                type: 'success',
                title: 'Done',
                showConfirmButton: false,
                timer: 1500
            })
            setTimeout(()=>{
                this.props.history.push('/home')
            },1500)
        })
    }

    render() {
        return (
            <Container logout={this.logout} profile_pic={this.props.profile_pic}>
                <div className='userRole'>
                    <h1>Choose Your Role</h1>
                    <div className='roles'>
                        <input type={'radio'} value={'organizer'} name={'role'} onChange={(e) => this.setState({ role: e.target.value })} /><span>Organizer</span>
                        <input type={'radio'} value={'attendee'} name={'role'} onChange={(e) => this.setState({ role: e.target.value })} /><span>Attendee</span>
                    </div>
                    <div className='roleButton'>
                        <button onClick={this.addRole}>Done</button>
                    </div>
                </div>
            </Container>
        )
    }
}

export default Role

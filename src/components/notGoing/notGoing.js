import React, { Component } from 'react';
import firebase from 'firebase'
import swal from 'sweetalert2'
import Container from '../../Container/container/container';
import Card from '../Cards/card';


class NotGoingEvent extends Component {
    constructor() {
        super()

        this.state = {
            notGoingEvents: []
        }
    }

    componentWillMount() {
        const { notGoingEvents } = this.state
        const user = localStorage.getItem('userUid')
        const { goingEvents } = this.state
        !user && this.props.history.push('/')
        swal({
            onOpen: () => {
                swal.showLoading()
            },
        })

        firebase.database().ref('/users/' + user + '/notGoingEvents/').on('child_added', (snapShot) => {
            console.log(snapShot.key)
            notGoingEvents.push(snapShot.key)
            swal({
                showConfirmButton: false,
                timer: 100
            })
            this.setState({goingEvents})
        })
    }

    componentDidMount() {
        const user = localStorage.getItem('userUid')
    }

    logout() {                          //logout the user and clear the localStorage
        localStorage.setItem('user', '')
        this.props.history.push('/')
        localStorage.removeItem('profile_pic')
        localStorage.removeItem('userUid')
    }

    render() {
        const { notGoingEvents } = this.state
        return (
            <Container logout={this.logout} profile_pic={this.props.profile_pic}>
                <h1>Not Going Events</h1>
                {
                    notGoingEvents.map((items,index) =>{
                        return <Card key={index} attendee={true} eventUid={index} notgoings={notGoingEvents} userEvent={items}/>
                    })
                }
            </Container>
        )
    }
}

export default NotGoingEvent;

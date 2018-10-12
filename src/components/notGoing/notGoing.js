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
            this.setState({ notGoingEvents })
        })
    }

    componentDidMount() {
        const { notGoingEvents } = this.state
        if (notGoingEvents) {
            swal({
                showConfirmButton: false,
                timer: 100
            })
        }
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
                    notGoingEvents.map((items, index) => {
                        return <Card key={index} color={'red'} shadow={'red'} attendee={true} eventUid={index} notgoings={notGoingEvents} userEvent={items} />
                    })
                }
                {
                    notGoingEvents.length === 0 &&
                    <h1 style={{marginTop: '3em', color:'red'}}>No Events Found!</h1>
                }
            </Container>
        )
    }
}

export default NotGoingEvent;

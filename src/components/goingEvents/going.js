import React, { Component } from 'react';
import firebase from 'firebase'
import swal from 'sweetalert2'
import Container from '../../Container/container/container';
import Card from '../Cards/card';


class GoingEvent extends Component {
    constructor() {
        super()

        this.state = {
            goingEvents: []
        }
    }

    componentWillMount() {
        const user = localStorage.getItem('userUid')
        const { goingEvents } = this.state
        !user && this.props.history.push('/')
        swal({
            onOpen: () => {
                swal.showLoading()
            },
        })

        firebase.database().ref('/users/' + user + '/goingEvents/').on('child_added', (snapShot) => {
            console.log(snapShot.key)
            goingEvents.push(snapShot.key)
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
        const { goingEvents } = this.state
        return (
            <Container logout={this.logout} profile_pic={this.props.profile_pic}>
                <h1>Going Events</h1>
                {
                    goingEvents.map((items,index) =>{
                        return <Card key={index} attendee={true} eventUid={index} goings={goingEvents} userEvent={items} checkEvent={'goingEvents'}/>
                    })
                }
            </Container>
        )
    }
}

export default GoingEvent;

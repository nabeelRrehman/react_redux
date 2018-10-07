import React, { Component } from 'react';
import './attendee.css'
import firebase from 'firebase'
import EventCard from '../../../components/EventCard/eventCard';
import { Link } from 'react-router-dom';

class Attendee extends Component {
    constructor() {
        super()

        this.state = {
            events: []
        }
    }

    componentDidMount() {
        const { events } = this.state
        const user = localStorage.getItem('userUid')
        user &&
            firebase.database().ref('/events/').on('child_added', (snapShot) => {
                console.log(snapShot.key)
                events.push(snapShot.key)
                this.setState({ events })
            })
    }

    render() {
        const { events } = this.state
        return (
            <div>
                <h1>Attendee</h1>
                <div className='userInterest'>
                    <div>
                        <Link to='/home/going' className='going'>Going</Link>
                    </div>
                    <div>
                        <Link to='/home/not-going' className='going'>Not Going</Link>
                    </div>
                </div>
                {events.length > 0 && events.map((items, index) => {
                    return <EventCard user={items} attendee={true} key={index} />
                })}
            </div>
        )
    }
}

export default Attendee;

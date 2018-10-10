import React, { Component } from 'react';
import './attendee.css'
import firebase from 'firebase'
import EventCard from '../../../components/EventCard/eventCard';
import { Link } from 'react-router-dom';

class Attendee extends Component {
    constructor() {
        super()

        this.state = {
            events: [],
            going: [],
            notgoing : []
        }
    }

    componentDidMount() {
        const { events} = this.state
        const user = localStorage.getItem('userUid')
        user &&
            firebase.database().ref('/events/').on('child_added', (snapShot) => {
                console.log(snapShot.key)
                events.push(snapShot.key)
                this.setState({ events })
            })
        
    }

    render() {
        const { events, going,notgoing } = this.state
        return (
            <div>
                <div>
                    <h1 value='abc'>All Event</h1>
                </div>
                <div className='userInterest'>
                    <div>
                        <Link to='/goingEvents' className='going'>Going</Link>
                    </div>
                    <div>
                        <Link to='/notGoingEvents' className='going'>Not Going</Link>
                    </div>
                </div>
                {events.length > 0 && events.map((items, index) => {
                    return <EventCard user={items} attendee={true} eventUid={index} goings={going} notgoings = {notgoing}/>
                })}
            </div>
        )
    }
}

export default Attendee;

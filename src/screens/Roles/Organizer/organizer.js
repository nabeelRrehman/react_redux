import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import './organizer.css'

//  font awesome library and icons

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import AddEvent from '../../../components/addEvent/addevent';
import EventCard from '../../../components/EventCard/eventCard';
library.add(faPlus)
library.add(faTimes)


class Organizer extends Component {
    constructor() {
        super()

        this.state = {
            addForm: false
        }
    }

    renderAddBtn() {
        const { addForm } = this.state
        return (
            <nav className="container" onClick = {() => this.setState({addForm : !addForm})} tooltip={!addForm ? "Create an Event" : "Cancel"}>
                {
                    !addForm ?
                        <FontAwesomeIcon className='buttons' icon='plus'/> :
                        <FontAwesomeIcon className='buttons' icon='times' />
                }
            </nav>
        );
    }

    render() {
        const user = localStorage.getItem('userUid')
        const { addForm } = this.state
        return (
            <div>
                {!addForm && <h1>All Events</h1>}
                {addForm && <AddEvent />}
                {!addForm && <EventCard user = {user} attendee = {false}/>}
                {this.renderAddBtn()}
            </div>
        )
    }
}

export default Organizer;

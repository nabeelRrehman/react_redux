import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import './addevent.css'

class AddEvent extends Component {

    render() {
        return (
            <div className='main-container'>
                <div className='first-child'>
                    <div className='head-h1'>
                        <h2>Add Event</h2>
                    </div>
                    <div className='second-child'>
                        <div className='event-fields'>
                            <input type='text' placeholder='Event Name'/>
                        </div>
                        <div className='event-fields'>
                            <input type='text' placeholder='Event details'/>
                        </div>
                        <div className='event-fields'>
                            <input type='text' placeholder='Event Location'/>
                        </div>
                        <div className='event-fields'>
                            <input type='number' placeholder='Start Time'/>
                        </div>
                        <div className='event-fields'>
                            <input type='text' placeholder='End Time'/>
                        </div>
                        <div>
                            <button className ='event-button'>
                                ADD
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default AddEvent;

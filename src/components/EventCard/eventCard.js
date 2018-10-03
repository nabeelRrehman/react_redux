import React, { Component } from 'react';
import image from '../../Assets/images/index.png'
import './eventCard.css'
import firebase from 'firebase'
import { toHtml } from '@fortawesome/fontawesome-svg-core';


class EventCard extends Component {
    constructor() {
        super()

        this.state = {
            event: []
        }

    }

    componentDidMount() {
        const { event } = this.state
        const user = localStorage.getItem('userUid')
        user &&
            firebase.database().ref('/events/').on('child_added', (snapShot) => {
                const data = snapShot.val()
                const card = {
                    image: data.imageUrl,
                    name: data.name,
                    detail: data.detail,
                    ticket: data.ticket
                }
                event.push(card)
                this.setState({ event })
            })

    }

    eventCard(image, title, description, ticket,index) {
        return (
            <div className='event-card' key = {`${index}`}>
                <div className='event-card-img'>
                    <img src={image} />
                </div>
                <div className='event-card-title'>
                    <span>{title}</span>
                </div>
                <div className={'event-card-description'}>
                    <p>{description}</p>
                </div>
                <div className='event-card-footer'>
                    <button>Learn more</button>
                    <button>Buy</button>
                    <span><b>Ticket</b> : {ticket}</span>
                </div>
            </div>
        )
    }

    render() {
        const { event } = this.state
        return (
            <div className='main-container'>
                {
                    event.map((items,index) => {
                        return this.eventCard(items.image, items.name, items.detail, items.ticket,index)
                    })
                }
            </div>
        );
    }
}

export default EventCard;

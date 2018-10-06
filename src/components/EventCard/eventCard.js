import React, { Component } from 'react';
import './eventCard.css'
import firebase from 'firebase'
import swal from 'sweetalert2'
import { Link } from 'react-router-dom'

class EventCard extends Component {
    constructor() {
        super()

        this.state = {
            event: []
        }
    }

    componentDidMount() {
        const { event } = this.state
        swal({
            onOpen: () => {
                swal.showLoading()
            },
        })
        firebase.database().ref('/events/' + this.props.user + '/').on('child_added', (snapShot) => {
            const data = snapShot.val()
            const card = {
                image: data.imageUrl,
                name: data.name,
                detail: data.detail,
                ticket: data.ticket,
                price: data.price,
                key: snapShot.key,
                seats: data.seats
            }
            event.push(card)
            this.setState({ event })
            swal({
                showConfirmButton: false,
                timer: 100
            })
        })

    }

    eventCard(image, title, description, ticket, price, index, key, seats) {
        const { attendee } = this.props
        return (
            <div className='event-card' key={`${index}`}>
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
                    {
                        attendee && <button disabled={seats == 0 && 'disabled'} className={seats == 0 ? 'btnToggle' : ''}>
                        {
                            seats == 0 ?
                            'Sold':
                            <Link to={`${'/buy/'}${key}`} style={{color: 'white',textDecoration: 'none'}}>Buy</Link>
                        }
                        </button>
                    }
                    {
                        !attendee && <button className = 'linked'>buy</button>
                    }
                    {
                        // <button >Detail</button>
                        <Link to={`${'/details/'}${key}`} className={'link'}>Details</Link>
                    }
                    <span><b>Ticket</b> : {!price && ticket}</span>
                    {
                        price &&
                        <span><b>Rs : </b> {price && price}</span>
                    }
                </div>
            </div>
        )
    }

    render() {
        const { event } = this.state
        return (
            <div className='main-container'>

                {
                    event.map((items, index) => {
                        return this.eventCard(items.image, items.name, items.detail, items.ticket, items.price, index, items.key, items.seats)
                    })
                }
            </div>
        );
    }
}

export default EventCard;

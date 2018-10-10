import React, { Component } from 'react';
import firebase from 'firebase'
import swal from 'sweetalert2'
import { Link } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'

library.add(faTimesCircle)
library.add(faCheckCircle)


class Card extends Component {
    constructor() {
        super()

        this.state = {
            event: [],
            counter: 0,
            goings: [],
            notgoings: [],
            arr: [],
            reserved: [],
            totalSeatsLength: []
        }
    }

    componentWillMount() {
        const { event, reserved } = this.state
        const user = localStorage.getItem('userUid')
        firebase.database().ref('/events/').on('child_added', (snapShot) => {
            for (var key in snapShot.val()) {
                if (key === this.props.userEvent) {
                    console.log(snapShot.val()[key])
                    const data = snapShot.val()[key]
                    const card = {
                        image: data.imageUrl,
                        name: data.name,
                        detail: data.detail,
                        ticket: data.ticket,
                        price: data.price,
                        key: this.props.userEvent,
                        seats: data.seatingArrange
                    }
                    event.push(card)
                    const totalSeats = []
                    const from = data.seatingArrange.from
                    const to = data.seatingArrange.to
                    for (var i = Number(from); i <= Number(to); i++) {
                        totalSeats.push(i)
                    }

                    this.setState({ event, totalSeats })
                }
            }

            firebase.database().ref('users').on('child_added', (snapShots) => {
                const totalReserved = []
                for (var key in snapShots.val()) {
                    const value = snapShots.val()[key];
                    if (key === 'buyEvents') {
                        for (var key2 in value) {
                            console.log(snapShot.key)
                            if (key2 === this.props.userEvent) {
                                for (var key3 in value[key2]) {
                                    // console.log(value[key2][key3].seats)
                                    totalReserved.push(...value[key2][key3].seats)
                                    this.setState({ totalReserved }, () => {
                                        // console.log('reserved***', this.state.totalReserved)
                                        // console.log('totalseats***', totalSeats)
                                        this.state.totalReserved.length === this.state.totalSeats.length &&
                                            reserved.push(key2)
                                    })
                                }
                            }
                        }
                    }
                }
                this.setState({ reserved })
            })

            swal({
                showConfirmButton: false,
                timer: 100
            })
        })
    }

    interested(id, key) {
        const user = localStorage.getItem('userUid')
        firebase.database().ref('/users/' + user + '/goingEvents/' + key).remove()
        this.setState
    }

    notGoing(id, key) {
        const user = localStorage.getItem('userUid')

        firebase.database().ref('/users/' + user + '/notGoingEvents/' + key).remove()
    }

    eventCard(image, title, description, ticket, price, index, key) {
        const { attendee, goings, notgoings } = this.props
        const { arr, reserved } = this.state
        console.log(reserved)
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
                {
                    attendee &&
                    <div className='user-interest'>
                        {
                            goings &&
                            goings.map((items, value) => {
                                return (
                                    items === key &&
                                    <div key={value} id={'green'} onClick={(e) => { this.interested(e.currentTarget.id, key) }}>
                                        <FontAwesomeIcon icon='check-circle' style={{ color: 'green' }} />
                                    </div>
                                )
                            })
                        }
                        {
                            notgoings &&
                            notgoings.map((items, value) => {
                                return (
                                    items === key &&
                                    <div key={value} id={'red'} onClick={(e) => this.notGoing(e.currentTarget.id, key)}>
                                        <FontAwesomeIcon icon='times-circle' style={{ color: 'red' }} />
                                    </div>
                                )
                            })
                        }
                    </div>
                }
                <div className='event-card-footer'>
                    {
                        attendee && <button disabled={reserved.indexOf(key) !== -1 && 'disabled'} className={reserved.indexOf(key) !== -1 ? 'btnToggle' : ''}>
                            {
                                reserved.indexOf(key) !== -1 ?
                                    'Sold' :
                                    <Link to={`${'/buy/'}${key}`} style={{ color: 'white', textDecoration: 'none' }}>Buy</Link>
                            }
                        </button>
                    }
                    {
                        !attendee && <button className='linked'>buy</button>
                    }
                    {
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

export default Card;

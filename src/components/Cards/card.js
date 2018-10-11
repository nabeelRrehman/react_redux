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
    constructor(props) {
        super(props)

        this.state = {
            event: [],
            counter: 0,
            goings: props.goings,
            notgoings: props.notgoings,
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

                        this.setState({ event, totalSeats }, () => {
                            console.log(this.state.totalSeats)
                        })
                    }
                }

            firebase.database().ref('users').on('value', (snapShots) => {
                const totalReserved = []
                for (var key1 in snapShots.val()) {
                    // console.log(snapShots.val())
                    for (var key in snapShots.val()[key1]) {
                        const value = snapShots.val()[key1][key];
                        if (key === 'buyEvents') {
                            for (var key2 in value) {
                                if (key2 === this.props.userEvent) {
                                    firebase.database().ref('/users/' + key1 + '/buyEvents/' + key2).on('child_added', (snaps) => {
                                        console.log(snaps.val())
                                        totalReserved.push(...snaps.val())
                                        this.setState({ totalReserved }, () => {
                                            console.log('total reserved', this.state.totalReserved)
                                            if (this.state.totalReserved.length === this.state.totalSeats.length) {
                                                reserved.push(this.props.userEvent)
                                                this.setState({ reserved }, () => {
                                                    console.log(this.state.reserved, 'seatsreserved key')
                                                })
                                            }
                                        })
                                    })
                                }
                            }
                        }
                    }
                }
            })
            swal({
                showConfirmButton: false,
                timer: 100
            })
        })

    }

    interest(id, key) {
        const { goings } = this.state
        const user = localStorage.getItem('userUid')
        firebase.database().ref('/users/' + user + '/goingEvents/' + key).remove()
        goings.splice(key, 1)
        this.setState({ goings })
    }

    notGoings(id, key) {
        const { notgoings } = this.state
        const user = localStorage.getItem('userUid')

        firebase.database().ref('/users/' + user + '/notGoingEvents/' + key).remove()
        notgoings.splice(key, 1)
        this.setState({ notgoings })
    }

    eventCard(image, title, description, ticket, price, index, key) {
        const { attendee } = this.props
        const { arr, reserved, goings, notgoings } = this.state
        console.log(reserved,'reserved seats')
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
                                    <div key={value} id={'green'} onClick={(e) => { this.interest(e.currentTarget.id, key) }}>
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
                                    <div key={value} id={'red'} onClick={(e) => this.notGoings(e.currentTarget.id, key)}>
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
        const { event, goings, notgoings } = this.state
        return (
            <div className='main-container'>
                {
                    event.map((items, index) => {

                        return (
                            goings &&
                            goings.indexOf(items.key) !== -1 &&
                            this.eventCard(items.image, items.name, items.detail, items.ticket, items.price, index, items.key, items.seats)
                        )
                    })
                }
                {
                    event.map((items, index) => {

                        return (
                            notgoings &&
                            notgoings.indexOf(items.key) !== -1 &&
                            this.eventCard(items.image, items.name, items.detail, items.ticket, items.price, index, items.key, items.seats)
                        )
                    })
                }
            </div>
        );
    }
}

export default Card;

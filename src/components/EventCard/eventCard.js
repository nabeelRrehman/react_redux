import React, { Component } from 'react';
import './eventCard.css'
import firebase from 'firebase'
import swal from 'sweetalert2'
import { Link } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import Sold from '../../Assets/images/sold.png'


library.add(faTimesCircle)
library.add(faCheckCircle)


class EventCard extends Component {
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
        this.getGoingEvents = this.getGoingEvents.bind(this)
        this.reservedSeats = this.reservedSeats.bind(this)
    }

    componentWillMount() {

        this.getGoingEvents()
        this.reservedSeats()
    }


    getGoingEvents() {

        const { goings, notgoings, arr } = this.state
        const user = localStorage.getItem('userUid')

        firebase.database().ref('/users/' + user + '/goingEvents/').on('child_added', (snapShot) => {
            goings.push(snapShot.key)
            arr.push(snapShot.key)
            this.setState({ goings, arr })
        })

        firebase.database().ref('/users/' + user + '/notGoingEvents/').on('child_added', (snapShot) => {
            notgoings.push(snapShot.key)
            arr.push(snapShot.key)
            this.setState({ notgoings, arr })
        })
        // const user = localStorage.getItem('userUid')
        firebase.database().ref('/users/' + user + '/goingEvents/').on('child_removed', (snapShot) => {
            const removedKey = goings.indexOf(snapShot.key)
            const arrRemovedKey = arr.indexOf(snapShot.key)
            if (removedKey !== -1) {
                goings.splice(removedKey, 1)
                if (arrRemovedKey !== -1) {
                    arr.splice(arrRemovedKey, 1)
                    this.setState({ arr })
                }
                this.setState({ goings })
            }
        })

        firebase.database().ref('/users/' + user + '/notGoingEvents/').on('child_removed', (snapShot) => {
            const removedKey = notgoings.indexOf(snapShot.key)
            const arrRemovedKey = arr.indexOf(snapShot.key)
            if (removedKey !== -1) {
                notgoings.splice(removedKey, 1)
                if (arrRemovedKey !== -1) {
                    arr.splice(arrRemovedKey, 1)
                    this.setState({ arr })
                }
                this.setState({ notgoings })
            }
        })
    }

    reservedSeats() {
        const user = localStorage.getItem('userUid')
        const { event, reserved } = this.state
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

            firebase.database().ref('users').on('value', (snapShots) => {
                const totalReserved = []
                for (var key1 in snapShots.val()) {
                    // console.log(key1,'user data')
                    for (var key in snapShots.val()[key1]) {
                        const value = snapShots.val()[key1][key];
                        if (key === 'buyEvents') {
                            for (var key2 in value) {
                                if (key2 === snapShot.key) {
                                    firebase.database().ref('/users/' + key1 + '/buyEvents/' + key2).on('child_added', (snaps) => {
                                        // console.log('*******', snaps.val())
                                        totalReserved.push(...snaps.val())
                                        this.setState({ totalReserved }, () => {
                                            if (this.state.totalReserved.length == totalSeats.length) {
                                                if (reserved.indexOf(snapShot.key) === -1) {
                                                    reserved.push(snapShot.key)
                                                }
                                            }
                                            this.setState({ reserved }, () => {
                                                console.log(this.state.reserved)
                                            })
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

    interested(id, key) {
        const user = localStorage.getItem('userUid')
        if (id === 'black') {
            firebase.database().ref('/users/' + user + '/goingEvents/' + key).push(true)
            swal({
                position: 'center',
                type: 'success',
                title: 'Interested',
                showConfirmButton: false,
                timer: 1500
            })
        }
        else if (id === 'green') {
            firebase.database().ref('/users/' + user + '/goingEvents/' + key).remove()
        }
    }

    notGoing(id, key) {
        const user = localStorage.getItem('userUid')
        if (id === 'black') {
            firebase.database().ref('/users/' + user + '/notGoingEvents/' + key).push(true)
            swal({
                position: 'center',
                type: 'success',
                title: 'Not Interested',
                showConfirmButton: false,
                timer: 1500
            })
        } else if (id === 'red') {
            firebase.database().ref('/users/' + user + '/notGoingEvents/' + key).remove()
        }
    }

    eventCard(image, title, description, ticket, price, index, key, seats) {
        const { attendee } = this.props
        const { goings, notgoings, arr, totalReserved, totalSeats, reserved } = this.state
        return (
            <div className='event-card' style = {reserved.indexOf(key) !== -1 ? {opacity : '0.9'} : {opacity : '1'}} key={`${index}`}>
                <div className='event-card-img'>
                    <img src={image} />
                    {
                        attendee &&
                        reserved.indexOf(key) !== -1 &&
                        <div className='event-card-sold'>
                            <img src={Sold} />
                        </div>
                    }
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
                            notgoings.map((items, value) => {
                                return (
                                    items === key &&
                                    <div key={value} id={'red'} onClick={(e) => this.notGoing(e.currentTarget.id, key)}>
                                        <FontAwesomeIcon icon='times-circle' style={{ color: 'red' }} />
                                    </div>
                                )
                            })
                        }
                        {
                            arr.length > 0 &&
                            arr.indexOf(key) === -1 &&
                            <div>
                                <div id={'black'} onClick={(e) => { this.interested(e.currentTarget.id, key) }}>
                                    <FontAwesomeIcon icon='check-circle' style={{ color: 'black' }} />
                                </div>
                                <div id={'black'} onClick={(e) => this.notGoing(e.currentTarget.id, key)}>
                                    <FontAwesomeIcon icon='times-circle' style={{ color: 'black' }} />
                                </div>
                            </div>

                        }
                        {
                            arr.length === 0 &&
                            <div>
                                <div id={'black'} onClick={(e) => { this.interested(e.currentTarget.id, key) }}>
                                    <FontAwesomeIcon icon='check-circle' style={{ color: 'black' }} />
                                </div>
                                <div id={'black'} onClick={(e) => this.notGoing(e.currentTarget.id, key)}>
                                    <FontAwesomeIcon icon='times-circle' style={{ color: 'black' }} />
                                </div>
                            </div>

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
                    <span><b>Ticket</b>:{!price && ticket}</span>
                    {
                        price &&
                        <span><b>Rs:</b> {price && price}</span>
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

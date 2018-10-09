import React, { Component } from 'react';
import './eventCard.css'
import firebase from 'firebase'
import swal from 'sweetalert2'
import { Link } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'

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
        }
        this.getGoingEvents = this.getGoingEvents.bind(this)
    }

    componentWillMount() {

        this.getGoingEvents()
    }


    getGoingEvents() {
        const { goings, notgoings, arr } = this.state
        const user = localStorage.getItem('userUid')

        firebase.database().ref('/users/' + user + '/goingEvents/').on('child_added', (snapShot) => {
            console.log(snapShot.key)
            goings.push(snapShot.key)
            arr.push(snapShot.key)
            this.setState({ goings, arr })
        })

        firebase.database().ref('/users/' + user + '/notGoingEvents/').on('child_added', (snapShot) => {
            console.log(snapShot.key)
            notgoings.push(snapShot.key)
            arr.push(snapShot.key)
            this.setState({ notgoings, arr })
        })
    }

    componentDidMount() {
        const user = localStorage.getItem('userUid')
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

    interested(id, key) {
        console.log(id)
        const user = localStorage.getItem('userUid')
        if (id === 'black') {
            firebase.database().ref('/users/' + user + '/goingEvents/' + key).push(true)
        }
        else if (id === 'green') {
            firebase.database().ref('/users/' + user + '/goingEvents/' + key).remove()
            this.getGoingEvents()
        }
        console.log(key)
        // this.setState({ going: !going , hideNotGoing : !hideNotGoing })
    }

    notGoing(key) {
        const { counter } = this.state
        const user = localStorage.getItem('userUid')
        if (counter === 0) {
            this.setState({ counter: 1 })
            firebase.database().ref('/notGoingEvents/' + user + '/' + key).push(true)
        } else {
            this.setState({ counter: 0 })
            firebase.database().ref('/goingEvent/' + user + '/' + key).remove()
        }
        console.log(key)
    }

    eventCard(image, title, description, ticket, price, index, key, seats) {
        const { attendee } = this.props
        const { goings, notgoings, arr, counter } = this.state
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
                <div className='user-interest'>
                    {
                        goings.map((items,value) => {
                            return (
                                items === key &&
                                <div key={value} id={'green'} onClick={(e) => { this.interested(e.currentTarget.id, key) }}>
                                    <FontAwesomeIcon icon='check-circle' style={{ color: 'green' }} />
                                </div>
                            )
                        })
                    }
                    {
                        notgoings.map((items,value) => {
                            return (
                                items === key &&
                                <div key={value}>
                                    <FontAwesomeIcon icon='times-circle' style={{ color: 'red' }} />
                                </div>
                            )
                        })
                    }
                    {
                        arr.length > 0 &&
                        arr[this.props.eventUid] !== key &&
                        <div>
                            <div id={'black'} onClick={(e) => { this.interested(e.currentTarget.id, key) }}>
                                <FontAwesomeIcon icon='check-circle' style={{ color: 'black' }} />
                            </div>
                            <div>
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
                            <div>
                                <FontAwesomeIcon icon='times-circle' style={{ color: 'black' }} />
                            </div>
                        </div>

                    }

                </div>
                <div className='event-card-footer'>
                    {
                        attendee && <button disabled={seats == 0 && 'disabled'} className={seats == 0 ? 'btnToggle' : ''}>
                            {
                                seats == 0 ?
                                    'Sold' :
                                    <Link to={`${'/buy/'}${key}`} style={{ color: 'white', textDecoration: 'none' }}>Buy</Link>
                            }
                        </button>
                    }
                    {
                        !attendee && <button className='linked'>buy</button>
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

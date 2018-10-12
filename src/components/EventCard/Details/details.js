import React, { Component } from 'react';
import Container from '../../../Container/container/container';
import firebase from 'firebase'
import swal from 'sweetalert2'
import './details.css'
import { Link } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

library.add(faTimesCircle)


class Details extends Component {
    constructor() {
        super()

        this.state = {
            totalSeats: [],
            totalReserved: []
        }
        this.logout = this.logout.bind(this)
    }

    componentWillMount() {
        const user = localStorage.getItem('userUid')
        !user && this.props.history.push('/')
        swal({
            onOpen: () => {
                swal.showLoading()
            },
        })

        firebase.database().ref('/users/' + user + '/userDetails/').on('child_added', (snapshot) => {
            console.log(snapshot.val())
            this.setState({ role: snapshot.val().role })
        })
    }

    componentDidMount() {
        const { totalSeats, totalReserved } = this.state
        const { id } = this.props.match.params
        // console.log('id***',id)
        firebase.database().ref('/events/').on('value', (snapShot) => {
            for (var key in snapShot.val()) {
                const eventKey = snapShot.val()[key]
                for (var key2 in eventKey) {
                    if (key2 === id) {
                        console.log(eventKey[key2])
                        const event = {
                            image: eventKey[key2].imageUrl,
                            name: eventKey[key2].name,
                            detail: eventKey[key2].detail,
                            ticket: eventKey[key2].ticket,
                            price: eventKey[key2].price,
                            key: key2,
                            seats: eventKey[key2].seatingArrange,
                            address: eventKey[key2].address,
                            startTime: eventKey[key2].startTime,
                            endTime: eventKey[key2].endTime,
                            arrangement: eventKey[key2].arrangement,
                            location: eventKey[key2].location
                        }
                        const seats = eventKey[key2].seatingArrange
                        for (var i = Number(seats.from); i <= Number(seats.to); i++) {
                            totalSeats.push(i)
                        }
                        this.setState({ event, totalSeats })
                    }
                }
            }
            swal({
                showConfirmButton: false,
                timer: 100
            })
        })

        firebase.database().ref('users').on('child_added', (snapShot) => {
            for (var key in snapShot.val()) {
                const value = snapShot.val()[key];
                if (key === 'buyEvents') {
                    for (var key2 in value) {
                        if (key2 === id) {
                            firebase.database().ref('/users/' + snapShot.key + '/buyEvents/' + key2 + '/').on('child_added', (snapshot) => {
                                console.log(snapshot.val())
                                totalReserved.push(...snapshot.val())
                                this.setState({ totalReserved }, () => {
                                    console.log(this.state.totalReserved)
                                })
                            })
                        }
                    }
                }
            }
        })
    }

    logout() {                          //logout the user and clear the localStorage
        localStorage.setItem('user', '')
        this.props.history.push('/')
        localStorage.removeItem('profile_pic')
        localStorage.removeItem('userUid')
    }

    render() {
        const { event, totalSeats, totalReserved, role } = this.state
        return (
            <Container logout={this.logout} profile_pic={this.props.profile_pic}>
                {
                    event &&
                    <div className='event-details'>
                        <div className='event-name'>
                            {event.name}
                            {
                                role === 'attendee' &&
                                totalSeats.length === totalReserved.length &&
                                <span className='event-closed'>
                                    <FontAwesomeIcon icon='times-circle' /> Sold Out
                                </span>
                            }
                        </div>
                        <div className='siting-arrange'>
                            <div>
                                Siting arrangement:
                            </div>
                            <div>
                                {event.arrangement}
                            </div>
                            <div>
                                Start Time:
                            </div>
                            <div>
                                {event.startTime}
                            </div>
                            <div>
                                End Time:
                        </div>
                            <div>
                                {event.endTime}
                            </div>
                            <div>
                               {
                                   role === 'attendee' ?
                                   'Seats/Left:':
                                   'Seats'
                               } 
                            </div>
                            <div>
                                {
                                    role === 'attendee' ?
                                    `${totalSeats.length}/${totalSeats.length - totalReserved.length}`:
                                    `${totalSeats.length}`
                                    
                                }
                                
                            </div>
                            <div>
                                Price Per Ticket:
                        </div>
                            <div>
                                {event.price ? event.price : 'free'}
                            </div>
                        </div>
                        <div className='event-pic'>
                            <img src={event.image} width={'100%'} height={'100%'} />
                        </div>
                        <div className='ticket-detail'>
                            <div>
                                Details:
                        </div>
                            <div>
                                {event.detail}
                            </div>
                            <div>
                                Address:
                        </div>
                            <div>
                                {event.address}
                            </div>
                            <div>
                                Location:
                        </div>
                            <div>
                                {event.location}
                            </div>
                            <div>
                                Ticket:
                        </div>
                            <div>
                                {event.ticket}
                            </div>
                        </div>
                        {
                            role === 'attendee' &&
                            (
                                totalSeats.length === totalReserved.length ?
                                    <div className='event-detail-btn'>
                                        <button disabled={'disabled'} style={{ opacity: '0.5' }}>SOLD</button>
                                    </div>
                                    :
                                    <div className='event-detail-btn'>
                                        <Link className='buyBtn' to={`${'/buy/'}${event.key}`} style={{ color: 'white', textDecoration: 'none' }}>Buy</Link>
                                    </div>
                            )
                        }
                    </div>
                }
            </Container>
        )
    }
}

export default Details

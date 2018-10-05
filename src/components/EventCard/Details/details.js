import React, { Component } from 'react';
import Container from '../../../Container/container/container';
import firebase from 'firebase'
import swal from 'sweetalert2'
import './details.css'
import Pic from '../../../Assets/images/index.png'


class Details extends Component {
    constructor() {
        super()

        this.state = {
        }
    }

    componentWillMount() {
        const user = localStorage.getItem('userUid')
        !user && this.props.history.push('/')
        swal({
            onOpen: () => {
                swal.showLoading()
            },
        })
    }

    componentDidMount() {
        const { event } = this.state
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
                            seats: eventKey[key2].seats,
                            address: eventKey[key2].address,
                            startTime: eventKey[key2].startTime,
                            endTime: eventKey[key2].endTime,
                            arrangement: eventKey[key2].arrangement,
                            location: eventKey[key2].location
                        }
                        this.setState({ event })
                    }
                }
            }
            swal({
                showConfirmButton: false,
                timer: 100
            })
        })
    }

    logout() {                          //logout the user and clear the localStorage
        localStorage.setItem('user', '')
        this.props.history.push('/')
        localStorage.removeItem('profile_pic')
        localStorage.removeItem('userUid')
    }

    render() {
        const { event } = this.state
        return (
            <Container logout={this.logout} profile_pic={this.props.profile_pic}>
                {
                    event &&
                    <div className='event-details'>
                        <div className='event-name'>
                            {event.name}
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
                                Seats:
                        </div>
                            <div>
                                {event.seats}
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
                        <div className='event-detail-btn'>
                            <button>BUY</button>
                        </div>
                    </div>
                }
            </Container>
        )
    }
}

export default Details

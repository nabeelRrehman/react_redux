import React, { Component } from 'react';
import Container from '../../../Container/container/container';
import firebase from 'firebase'
import swal from 'sweetalert2'

class Buy extends Component {
    constructor() {
        super()

        this.state = {
            user: '',
            profile_pic: ''
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
    }

    componentDidMount() {
        const { ticket } = this.props.match.params
        // console.log('id***',id)
        firebase.database().ref('/events/').on('value', (snapShot) => {
            for (var key in snapShot.val()) {
                const eventKey = snapShot.val()[key]
                for (var key2 in eventKey) {
                    if (key2 === ticket) {
                        // console.log(eventKey[key2])
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
        console.log(this.props.match.params)
        console.log(this.state.event)
        return (
            <Container logout={this.logout} profile_pic={this.props.profile_pic}>
                {
                    event &&
                    <div className='main-container'>
                        <div className='first-child'>
                            <div className='head-h1'>
                                <h2>BUY</h2>
                            </div>
                            <div className='second-child'>
                                <div className='event-fields'>
                                    <span>Event : </span>
                                    <input type='text' value={event.name} />
                                </div>
                                <div className='event-fields'>
                                    <span>Start Time : </span>
                                    <input type='text' value={event.startTime} />
                                </div>
                                <div className='event-fields'>
                                    <span>End Time : </span>
                                    <input type='text' value={event.endTime} />
                                </div>
                                <div className='event-fields'>
                                    <span>Price Per Ticket : </span>
                                    <input type='text' value={event.price ? event.price : event.ticket} />
                                </div>
                                <div className='event-fields'>
                                    <span> : </span>
                                    <input type='text' />
                                </div>
                                <div className='event-fields'>
                                    <input type='text' />
                                </div>
                                <div>
                                    <button className='event-button'>
                                        BUY
                            </button>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </Container>
        )
    }
}

export default Buy

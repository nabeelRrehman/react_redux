import React, { Component } from 'react';
import Container from '../../../Container/container/container';
import firebase from 'firebase'
import swal from 'sweetalert2'
import './buy.css'

class Buy extends Component {
    constructor() {
        super()

        this.state = {
            user: '',
            profile_pic: '',
            list: [],
            SelectedList: [],
            reservedSeats: []
        }
        this.logout = this.logout.bind(this)
    }

    componentWillMount() {
        const { reservedSeats } = this.state
        const user = localStorage.getItem('userUid')
        !user && this.props.history.push('/')
        swal({
            onOpen: () => {
                swal.showLoading()
            },
        })

        firebase.database().ref('/users/').on('child_added', (snapShot) => {
            for (var key in snapShot.val().buyEvents) {
                const bTickets = snapShot.val().buyEvents[key]
                // console.log(key)
                // console.log(this.props.match.params.ticket)
                if (key === this.props.match.params.ticket) {
                    console.log(bTickets)
                    for (var key2 in bTickets) {
                        console.log(bTickets[key2].seats)
                        reservedSeats.push(...bTickets[key2].seats)
                        this.setState({ reservedSeats }, () => {
                            console.log(this.state.reservedSeats)
                        })
                    }
                }
            }
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
                            seats: eventKey[key2].seatingArrange,
                            address: eventKey[key2].address,
                            startTime: eventKey[key2].startTime,
                            endTime: eventKey[key2].endTime,
                            arrangement: eventKey[key2].arrangement,
                            location: eventKey[key2].location
                        }
                        this.setState({ event }, () => {
                            const { list } = this.state
                            if (event.seats) {
                                for (var i = Number(event.seats.from); i <= event.seats.to; i++) {
                                    list.push(i)
                                }
                                this.setState({ list })
                                console.log(list)
                            }
                        })
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

    selectedOption(e) {
        this.setState({ selectedOption: e, SelectedList: [] })
        if (e === 'select') {
            this.setState({ selectedOption: '', SelectedList: [] })
        }
    }

    buyEvent() {
        const user = localStorage.getItem('userUid')
        const { selectedOption, from, to, SelectedList, reservedSeats, event } = this.state
        const eventTicket = this.props.match.params.ticket
        if (!selectedOption || selectedOption === 'select') {
            swal({
                type: 'error',
                title: 'Select ticket/seats',
            })
        } else {
            if (!from && !to && SelectedList.length === 0) {
                swal({
                    type: 'error',
                    title: 'something went wrong'
                })
            } else {
                if (from && to && SelectedList.length !== 0) {
                    swal({
                        type: 'error',
                        title: 'something went wrong'
                    })
                } else {
                    if (from && !to || !from && to) {
                        swal({
                            type: 'error',
                            title: 'something went wrong'
                        })
                    } else {
                        if (Number(from) > Number(to)) {
                            swal({
                                type: 'error',
                                title: 'something went wrong'
                            })
                        } else {
                            if (from && to) {
                                const array = []
                                for (var i = Number(from); i <= Number(to); i++) {
                                    array.push(i)
                                }
                                const intersection = array.filter(element => reservedSeats.includes(element));
                                if (intersection.length > 0) {
                                    swal({
                                        type: 'error',
                                        title: 'Selected Seats Are Already Reserved'
                                    })
                                } else {
                                    if (array.length > selectedOption) {
                                        swal({
                                            type: 'error',
                                            title: 'Dont have enough tickets'
                                        })
                                    } else {
                                        if (Number(to) > Number(event.seats.to)) {
                                            swal({
                                                type: 'error',
                                                title: 'Dont have enough seats'
                                            })
                                        } else {
                                            const obj = {
                                                seats: [...array]
                                            }
                                            firebase.database().ref('/users/' + user + '/buyEvents/' + eventTicket + '/').push(obj)
                                                .then(() => {
                                                    swal({
                                                        type: 'success',
                                                        title: 'Successfully Buy Tickets'
                                                    })
                                                })
                                            this.setState({ selectedOption: '', from: '', to: '', SelectedList: '' })
                                        }
                                    }
                                }
                            } else {
                                const obj = {
                                    seats: [...SelectedList]
                                }
                                firebase.database().ref('/users/' + user + '/buyEvents/' + eventTicket + '/').push(obj)
                                    .then(() => {
                                        swal({
                                            type: 'success',
                                            title: 'Successfully Buy Tickets'
                                        })
                                    })
                                this.setState({ selectedOption: '', from: '', to: '', SelectedList: '' })
                            }
                        }
                    }
                }
            }
        }
    }

    selectTicket(item, index) {
        const { SelectedList, selectedOption } = this.state
        const selectOpt = SelectedList.indexOf(item)
        if (SelectedList.length < selectedOption) {
            if (selectOpt !== -1) {
                SelectedList.splice(selectOpt, 1)
                this.setState({ SelectedList })
            } else {
                SelectedList.push(item)
                this.setState({ SelectedList })
            }
        } else {
            swal({
                type: 'error',
                title: `You Dont Have More Tickets`
            })
        }

    }

    render() {
        const { event, selectedOption, from, to, list } = this.state
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
                                    <input type='text' disabled={'disabled'} defaultValue={event.name} />
                                </div>
                                <div className='event-fields'>
                                    <span>Start Time : </span>
                                    <input type='text' disabled={'disabled'} defaultValue={event.startTime} />
                                </div>
                                <div className='event-fields'>
                                    <span>End Time : </span>
                                    <input type='text' disabled={'disabled'} defaultValue={event.endTime} />
                                </div>
                                <div className='event-fields'>
                                    <span>Price Per Ticket : </span>
                                    <input type='text' disabled={'disabled'} defaultValue={event.price ? event.price : event.ticket} />
                                </div>
                                <div className='event-fields'>
                                    <span>Ticket : </span>
                                    <select value={selectedOption} onChange={(e) => this.selectedOption(e.target.value)}>
                                        <option value='select'>Select No Of Ticket  Max: 10</option>
                                        <option value='1'>1</option>
                                        <option value='2'>2</option>
                                        <option value='3'>3</option>
                                        <option value='4'>4</option>
                                        <option value='5'>5</option>
                                        <option value='6'>6</option>
                                        <option value='7'>7</option>
                                        <option value='8'>8</option>
                                        <option value='9'>9</option>
                                        <option value='10'>10</option>
                                    </select>
                                </div>
                                {
                                    selectedOption &&
                                    <div>
                                        <div>Select Seats</div>
                                        <div className='event-fields'>
                                            From : <input type='number' value={from} onChange={(e) => this.setState({ from: e.target.value })} placeholder='From' />
                                        </div>
                                        <div className='event-fields'>
                                            To : <input type='number' value={to} onChange={(e) => this.setState({ to: e.target.value })} placeholder='To' />
                                        </div>
                                        <div>OR</div>
                                        <div className='event-seats'>
                                            <div className='seats'>
                                                {
                                                    list.map((items, index) => {
                                                        const { SelectedList, reservedSeats } = this.state
                                                        return (
                                                            reservedSeats.indexOf(items) !== -1 ?
                                                                <div key={index} style={{ color: 'white', backgroundColor: 'red' }}>{items}</div>
                                                                :
                                                                <span>
                                                                    {
                                                                        SelectedList.indexOf(items) !== -1 ?
                                                                            <div key={index} style={{ color: 'white', backgroundColor: 'green' }} onClick={() => this.selectTicket(items, index)}>{items}</div>
                                                                            :
                                                                            <div key={index} onClick={() => this.selectTicket(items, index)}>{items}</div>
                                                                    }
                                                                </span>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                }
                                <div>
                                    <button className='event-button' onClick={() => this.buyEvent()}>
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
import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import './addevent.css'
import swal from 'sweetalert2'
import firebase from 'firebase'


class AddEvent extends Component {
    constructor() {
        super()

        this.state = {
        }
        this.addEvent = this.addEvent.bind(this)
        this.imageFile = this.imageFile.bind(this)
    }

    imageFile() {
        var imageFile = document.querySelector('input[type=file]').files[0];
        // console.log(imageFile)
        var fileReader = new FileReader();
        // console.log(fileReader)

        fileReader.addEventListener("load", () => {
            const imageUrl = fileReader.result;
            console.log(imageUrl, "imageUrl")
            this.setState({ imageUrl })
        }, false);

        if (imageFile) {
            fileReader.readAsDataURL(imageFile)
        }
    }

    addEvent() {
        const { name, detail, location, startTime, endTime, imageUrl, address,
            ticket, price, arrangement, from, to } = this.state
        console.log(imageUrl)
        const userUid = localStorage.getItem('userUid')
        if (name && detail && location && startTime && endTime &&
            address && ticket && arrangement && from && to) {
            const seatingArrange = {
                from: from,
                to: to
            }
            const obj = {
                name, detail, location, startTime, endTime, imageUrl, userUid, address, ticket, price, arrangement, seatingArrange
            }
            if (ticket === 'paid' && price || ticket === 'free' && !price) {
                firebase.database().ref('/events/' + userUid + '/').push(obj)
                    .then(() => {
                        swal({
                            position: 'center',
                            type: 'success',
                            title: 'Successfully Add Event',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        this.setState({
                            name: '', detail: '', location: '', startTime: '',
                            endTime: '', imageUrl: '', address: '', ticket: '', price: '',
                            arrangement: '', from: '', to: ''
                        })

                    }).catch((error) => {
                        swal({
                            type: 'error',
                            title: error.message
                        })
                    })
            }
            else {
                swal({
                    text: 'Price not available',
                    type: 'error'
                })
            }
        } else {
            swal({
                text: 'Something went wrong',
                type: 'error'
            })
        }
    }

    render() {
        const { ticket, name, detail, location, startTime, endTime, address, price, arrangement, from, to } = this.state
        return (
            <div className='main-container'>
                <div className='first-child'>
                    <div className='head-h1'>
                        <h2>Add Event</h2>
                    </div>
                    <div className='second-child'>
                        <div className='event-fields'>
                            <input type='text' value={name} placeholder='Event Name' onChange={(e) => this.setState({ name: e.target.value })} />
                        </div>
                        <div className='event-fields'>
                            <input type='text' value={detail} placeholder='Event details' onChange={(e) => this.setState({ detail: e.target.value })} />
                        </div>
                        <div className='event-fields'>
                            <input type='text' value={location} placeholder='Event Location' onChange={(e) => this.setState({ location: e.target.value })} />
                        </div>
                        <div className='event-fields'>
                            <input type='text' value={startTime} placeholder='Start Time' onChange={(e) => this.setState({ startTime: e.target.value })} />
                        </div>
                        <div className='event-fields'>
                            <input type='text' value={endTime} placeholder='End Time' onChange={(e) => this.setState({ endTime: e.target.value })} />
                        </div>
                        <div className='event-fields'>
                            <input type='text' value={address} placeholder='Address' onChange={(e) => this.setState({ address: e.target.value })} />
                        </div>
                        <div className='event-radio'>
                            <div>
                                <input type='radio' name={'ticket'} value={'free'} onChange={(e) => this.setState({ ticket: e.target.value, price: '' })} />Free
                            </div>
                            <div>
                                <input type='radio' name={'ticket'} value={'paid'} onChange={(e) => this.setState({ ticket: e.target.value })} />Paid
                            </div>
                        </div>
                        {
                            ticket === 'paid' &&
                            <div className='event-fields'>
                                <input type='number' value={price} placeholder='Price Per Ticket' onChange={(e) => this.setState({ price: e.target.value })} />
                            </div>
                        }
                        <div className='event-fields'>
                            <input type='text' value={arrangement} placeholder='Siting Arrangement Details' onChange={(e) => this.setState({ arrangement: e.target.value })} />
                        </div>
                        <div className='event-fields'>
                            <div className='no_of_seats'>
                                Number Of Seats
                            </div>
                        </div>
                        <div className='event-fields'>
                            <input type='number' value={from} placeholder='From' onChange={(e) => this.setState({ from: e.target.value })} />
                        </div>
                        <div className='event-fields'>
                            <input type='number' value={to} placeholder='To' onChange={(e) => this.setState({ to: e.target.value })} />
                        </div>
                        <div className='event-fields'>
                            <input type='file' name="image" id="image" onChange={this.imageFile} />
                        </div>
                        <div>
                            <button className='event-button' onClick={this.addEvent}>
                                ADD
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default AddEvent;

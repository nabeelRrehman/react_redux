import React, { Component } from 'react';
import './signup.css'
import firebase from 'firebase'
import swal from 'sweetalert2'

class SignUp extends Component {
    constructor() {
        super()
        this.state = {
            name: '',
            email: '',
            password: ''
        }
    }
    // redirected user to Login Page

    loginPage() {
        this.props.history.push('/')
    }

    //initially check the user from local storage

    componentWillMount() {
        const user = localStorage.getItem('user')
        user && this.props.history.push('/home')
    }

    //Authenticate email and set into the state

    email(email) {
        var emailVal = email;
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var err = document.getElementById('emailErr');
        if (emailVal === ' ') {
            err.style.fontSize = '0.8em'
            err.innerHTML = '*please don`t left spaces'
            err.style.color = 'red'
        }
        else if (!re.test(emailVal) && emailVal.length >= 1) {
            err.style.fontSize = '0.8em'
            err.innerHTML = '*Enter email correctly'
            err.style.color = 'red'
        }
        else {
            err.innerHTML = ''
            this.setState({
                email: emailVal
            })
        }
    }

    //Authenticate password and set into the state

    password(password) {
        var passVal = password;
        var err = document.getElementById('passwordErr');
        if (passVal.indexOf(' ') !== -1) {
            err.style.fontSize = '0.8em'
            err.innerHTML = '*please don`t left spaces'
            err.style.color = 'red'
        }
        else if (passVal.length <= 3 && passVal.length >= 1) {
            err.style.fontSize = '0.8em'
            err.innerHTML = 'Password Strength : Too Short'
            err.style.color = 'red'
        }
        else if (passVal.length <= 7 && passVal.length >= 1) {
            err.style.fontSize = '0.8em'
            err.innerHTML = 'Password Strength : Short'
            err.style.color = 'yellow'
        }
        else if (passVal.length <= 15 && passVal.length >= 1) {
            err.style.fontSize = '0.8em'
            err.innerHTML = 'Password Strength : Strong'
            err.style.color = 'green'
            this.setState({
                password: passVal
            })
        }
        else {
            err.innerHTML = ''
        }
    }

    // signup Authentication using firebase

    signUpAuth() {
        const { email, password } = this.state
        email && password ?
            swal({
                onOpen: () => {
                    swal.showLoading()
                }
            }) +
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(() => {
                    swal({
                        position: 'center',
                        type: 'success',
                        title: 'Successfully registered',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    setTimeout(() => {
                        this.props.history.push('/')
                    }, 1500)
                })
                .catch((error) => {
                    var credential = firebase.auth.EmailAuthProvider.credential(email, password);
                    firebase.auth().currentUser.linkAndRetrieveDataWithCredential(credential).then(function (usercred) {
                        var user = usercred.user;
                        console.log("Account linking success", user);
                        swal({
                            position: 'center',
                            type: 'success',
                            title: 'Successfully Linked Account',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        setTimeout(() => {
                            this.props.history.push('/')
                        }, 1500)
                    }, function (error) {
                        swal({
                            type: 'error',
                            title: 'Successfully Linked Account',
                            showConfirmButton: true
                        })
                    });
                }) :
            alert('write Something')

    }
    // SignUp Page JSX
    render() {
        return (
            <div>
                <div className='header'>
                    <h1>SignUp</h1>
                </div>
                <div className='main-container'>
                    <div className='flex-box'>
                        <div className="field1">
                            SIGNUP
                    </div>
                        <div className="field1" onClick={this.loginPage.bind(this)}>
                            LOGIN
                    </div>
                        <div className='signUpDiv'>
                            <div className="sign-up">
                                SIGN UP HERE
                        </div>
                            <div className='input-fields'>
                                <input type='text' placeholder='Name*' onChange={(e) => this.setState({ name: e.target.value })} />
                                <br />
                                <span id='err' />
                            </div>
                            <div className='input-fields'>
                                <input type='email' placeholder='Email*' onChange={(e) => this.email(e.target.value)} />
                                <br />
                                <span id='emailErr' />
                            </div>
                            <div className='input-fields'>
                                <input type='password' placeholder='Password*' onChange={(e) => this.password(e.target.value)} />
                                <br />
                                <span id='passwordErr' />
                            </div>
                            <div className='input-fields'>
                                <button className='button' onClick={this.signUpAuth.bind(this)}>Sign Up</button>
                            </div>
                            <div className='fields'>
                                <h5>Already Registered ?<button className='signuplink' onClick={this.loginPage.bind(this)}> Login now</button></h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default SignUp;

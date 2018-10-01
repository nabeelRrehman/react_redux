import React, { Component } from 'react';
import './login.css'
import Facebook from '../../Assets/images/facebook.png'
import Google from '../../Assets/images/google.png'
import firebase from 'firebase'
import swal from 'sweetalert2'
import { connect } from 'react-redux'
import { changeState } from '../../store/action/action'


class Login extends Component {
    constructor() {
        super()
        this.state = {
            email: '',
            password: '',
            profile_pic: ''
        }
    }
    //initially get the user from localstorage

    componentWillMount() {
        const user = localStorage.getItem('user')
        user && this.props.history.push('/home')
    }

    // redirecting user to the signup Page

    signupPage() {
        this.props.history.push('/signup')
    }

    //login Authentication with email and password
    login() {
        const { email, password } = this.state
        email && password ?
            swal({
                onOpen: () => {
                    swal.showLoading()
                },
            }) +
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then(() => {
                    localStorage.setItem('user', true)
                    swal({                          //sweetalert library 
                        position: 'center',
                        type: 'success',
                        title: 'Successfully Login',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    setTimeout(() => {
                        this.props.history.push('/home')
                    }, 1500)
                }).catch(error => swal({                          //sweetalert library 
                    type: 'error',
                    title: error.message,
                }))
            :
            alert('fill the fields')

    }

    // facebook Authentication with firebase

    fbAuth() {
        const fb_provider = new firebase.auth.FacebookAuthProvider()
        firebase.auth().signInWithPopup(fb_provider)
            .then(success => {
                const pic = success.additionalUserInfo.profile.picture.data.url
                localStorage.setItem('user', true)
                this.props.history.push('/home')
                this._changeData(pic)
                localStorage.setItem("profile_pic", pic)   //set user's profile_pic in localStorage
            })
            .catch(error => {
                firebase.auth().currentUser.linkWithPopup(fb_provider).then(function (result) {
                    // Accounts successfully linked.
                    var credential = result.credential;
                    var user = result.user;
                    console.log(credential)
                    console.log(user)


                    var prevUser = firebase.auth().currentUser;
                    // Sign in user with another account
                    firebase.auth().signInWithCredential(credential).then(function (user) {
                        console.log("Sign In Success", user);
                        var currentUser = user;
                        // Merge prevUser and currentUser data stored in Firebase.
                        // Note: How you handle this is specific to your application

                        // After data is migrated delete the duplicate user
                        return user.delete().then(function () {
                            // Link the OAuth Credential to original account
                            return prevUser.linkWithCredential(credential);
                        }).then(function () {
                            // Sign in with the newly linked credential
                            return firebase.auth().signInWithCredential(credential);
                        });
                    }).catch(function (error) {
                        console.log("Sign In Error", error);
                    });
                    // ...
                }).catch(function (error) {
                    // Handle Errors here.
                    // ...
                });
            })
    }

    _changeData(profile_pic) {
        // const { profile_pic } = this.state
        // console.log('event called');
        this.props.chengeStateToReducer(profile_pic)
    }

    //Google+ Authentication with firebase

    googleAuth() {
        const base_provider = new firebase.auth.GoogleAuthProvider()
        firebase.auth().signInWithPopup(base_provider)
            .then(success => {
                const pic = success.additionalUserInfo.profile.picture
                console.log(success)
                localStorage.setItem('user', true)
                this.props.history.push('/home')
                this._changeData(pic)
                localStorage.setItem("profile_pic", pic)         //set user's profile_pic in localStorage
            })
            .catch(error => alert(error.message))
    }

    // Login page JSX
    render() {
        return (
            <div>
                <div className='header'>
                    <h1>Login</h1>
                </div>
                <div className='main-container'>
                    <div className='flex-box'>
                        <div className="field1" onClick={this.signupPage.bind(this)}>
                            SIGNUP
                    </div>
                        <div className="field1">
                            LOGIN
                    </div>
                        <div className='signUpDiv'>
                            <div className="sign-up">
                                LOGIN HERE
                            </div>
                            <div className='input-fields'>
                                <input type='email' placeholder='Email*' onChange={(e) => this.setState({ email: e.target.value })} />
                            </div>
                            <div className='input-fields'>
                                <input type='password' placeholder='Password*' onChange={(e) => this.setState({ password: e.target.value })} />
                            </div>
                            <div className='input-fields'>
                                <button className='button' onClick={this.login.bind(this)} >Login</button>
                            </div>
                            <div className='fields'>
                                <h5>Sign In With?
                                </h5>
                                <button className='signuplink'>
                                    <img className='_image' onClick={this.fbAuth.bind(this)} alt={'facebook'} src={Facebook} />
                                    <img className='_image' onClick={this.googleAuth.bind(this)} alt={'google+'} src={Google} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

//set the state using redux

function mapStateToProps(state) {
    console.log(state)
    return ({
        profile_pic: state.rootReducer.profile_pic, //set the profile pic
    })
}

function mapDispatchToProps(dispatch) {
    return ({
        chengeStateToReducer: (text) => {
            dispatch(changeState(text))
        }
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);

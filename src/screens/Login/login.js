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
        this.checkRole = this.checkRole.bind(this)
    }
    //initially get the user from localstorage

    componentWillMount() {
        const user = localStorage.getItem('user')
        user && this.props.history.push('/home')
    }

    componentDidMount() {
        swal({
            showConfirmButton: false,
            timer: 100
        })
    }
    // redirecting user to the signup Page

    signupPage() {
        this.props.history.push('/signup')
    }

    //login Authentication with email and password
    login() {
        const that = this
        const { email, password } = this.state
        email && password ?
            swal({
                onOpen: () => {
                    swal.showLoading()
                },
            }) +
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then((success) => {
                    localStorage.setItem('user', true)
                    localStorage.setItem('userUid', success.user.uid)
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
                }).catch(error => {
                    var credential = firebase.auth.EmailAuthProvider.credential(email, password);
                    firebase.auth().currentUser.linkAndRetrieveDataWithCredential(credential).then(function (usercred) {
                        var user = usercred.user;
                        localStorage.setItem('user', true)
                        console.log("Account linking success", user);

                        swal({
                            position: 'center',
                            type: 'success',
                            title: 'Successfully Linked Account',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        localStorage.setItem("userUid", user.uid)
                        that.checkRole(user.uid)
                    }, function (error) {
                        var prevUser = firebase.auth().currentUser;
                        // Sign in user with another account
                        firebase.auth().signInWithCredential(credential).then(function (user) {
                            console.log("Sign In Success", user);
                            var currentUser = user;
                            localStorage.setItem('user', true)

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
                            swal({
                                type: 'error',
                                title: error.message,
                                showConfirmButton: true
                            })
                        });


                    });
                })
            :
            alert('fill the fields')

    }

    checkRole(user) {
        firebase.database().ref('/users/').on('value', (snapShot) => {
            console.log(snapShot.val())
            if (snapShot.val()) {
                if (!snapShot.val()[user]) {
                    console.log('nhi mila')
                    this.props.history.push('/role')
                } else {
                    console.log('mil gaya')
                    this.props.history.push('/home')
                }
            } else {
                this.props.history.push('/role')
            }
        })
    }

    // facebook Authentication with firebase

    fbAuth() {
        const fb_provider = new firebase.auth.FacebookAuthProvider()
        firebase.auth().signInWithPopup(fb_provider)
            .then(success => {
                const pic = success.additionalUserInfo.profile.picture.data.url
                localStorage.setItem('user', true)
                this._changeData(pic)
                localStorage.setItem("profile_pic", pic)   //set user's profile_pic in localStorage
                console.log(success)
                localStorage.setItem("userUid", success.user.uid)
                this.checkRole(success.user.uid)
            })
            .catch(error => {
                let that = this
                console.log(error)
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

                        return firebase.auth().signInWithCredential(credential)
                            .then((success) => {
                                console.log(success)
                                localStorage.setItem('user', true)
                                localStorage.setItem("userUid", success.uid)
                                swal({
                                    position: 'center',
                                    type: 'success',
                                    title: 'Successfully Login',
                                    showConfirmButton: false,
                                    timer: 1500
                                })
                                that.checkRole(success.uid)
                                localStorage.setItem("userUid", success.uid)
                                this._changeData(success.photoURL)
                            })
                        // After data is migrated delete the duplicate user
                        // return user.delete().then(function () {
                        //     // Link the OAuth Credential to original account
                        //     return prevUser.linkWithCredential(credential);
                        // }).then(function () {
                        //     // Sign in with the newly linked credential
                        // });
                    }).catch(function (error) {
                        console.log("Sign In Error", error);
                        swal({
                            type: 'error',
                            title: error.message,
                            showConfirmButton: true
                        })
                    });
                    // ...
                }).catch(function (error) {
                    // Handle Errors here.
                    swal({
                        type: 'error',
                        title: error.message,
                    })
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
                this._changeData(pic)
                localStorage.setItem("profile_pic", pic)         //set user's profile_pic in localStorage
                this.checkRole(success.user.uid)
                localStorage.setItem("userUid", success.user.uid)
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

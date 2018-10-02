import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import Anonymous from '../../Assets/images/user.png'

class Container extends Component {
    constructor() {
        super()

        this.state = {
            // profile_pic : ''
        }
    }

    // componentWillMount() {
    //     console.log(this.props.profile_pic)
    //     const profile_pic = this.props.profile_pic
    //     this.setState({profile_pic : profile_pic})
    // }  

    render() {
        return (
            <div>
                <div className='homepage'>
                    <h1>Events</h1>
                    <div className='profile_pic_div'><img alt={'profile_pic'}  className={'profile_pic'} src={this.props.profile_pic || localStorage.getItem('profile_pic') || Anonymous} /></div>
                    <div>
                        <button onClick={this.props.logout}>Logout</button>
                    </div>
                </div>
                <div>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default Container

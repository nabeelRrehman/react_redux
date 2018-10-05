import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Anonymous from '../../Assets/images/user.png'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'

library.add(faHome)

class Container extends Component {
    constructor() {
        super()

        this.state = {
            // profile_pic : ''
        }
    }

    render() {
        return (
            <div>
                <div className='homepage'>
                    <div className = 'home-icon'>
                        <Link to='/home' style={{color:'white'}}><FontAwesomeIcon icon = 'home' className='icon'/></Link>
                    </div>
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

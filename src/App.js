import React, { Component } from 'react';
import Routers from './Route';
import {Provider} from 'react-redux'
import store from './store'

class App extends Component {
//   constructor() {
//     super()
//   }
//   componentWillMount() {
//     console.log(this.props)
//     const user = localStorage.getItem('user')
//     user && 
//     this.props.history.push('/home')
// }

  render() {
    return (
    
      //Routers
      
      <Provider store = {store}>
        <Routers />   
      </Provider>
    );
  }
}

export default App;

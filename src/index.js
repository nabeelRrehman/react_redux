import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import firebase from 'firebase'
import registerServiceWorker from './registerServiceWorker';

var config = {
    apiKey: "AIzaSyAXq-URgmRiuU0xq7c9nnPbGxwNUZXOwjs",
    authDomain: "task-c82c1.firebaseapp.com",
    databaseURL: "https://task-c82c1.firebaseio.com",
    projectId: "task-c82c1",
    storageBucket: "task-c82c1.appspot.com",
    messagingSenderId: "92362446484"
  };
  firebase.initializeApp(config);



ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

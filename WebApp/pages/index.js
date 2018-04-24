import React, { Component } from 'react'

import {Stylesheet} from '../components/stylesheet.js'
import sheet from '../components/base.scss'
import { render } from 'react-dom'
import { HashRouter } from 'react-router-dom'

import App from '../components/app/app.js'
import LoginRegister from '../components/loginRegister/loginRegister.js'

// Firebase config
import * as firebase from 'firebase'

var config = {
  apiKey: "AIzaSyAm2AxvW9dp_lAsP_hvgAUYnGWKGro8L00",
  authDomain: "neo-market-8a303.firebaseapp.com",
  databaseURL: "https://neo-market-8a303.firebaseio.com",
  projectId: "neo-market-8a303",
  storageBucket: "neo-market-8a303.appspot.com",
  messagingSenderId: "1035941360979"
};

if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

// Need authentication to allow access to database.
firebase.auth().signInWithEmailAndPassword('nccheung@ucsc.edu', 'nccheung').then(console.log('Login successfully')).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
});

/**

@ Nicholas

@ 03/04/2018

Purpose: index page component to allow for navigation to the posts page.

**/

export class Index extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      loading: true,
      error: '',
      cart: ['yolo', 'swag'],
      data: {},
      inApp: false
    }
    this.navToApp = this.navToApp.bind(this);
  }

  navToApp = () => {
    this.setState( {inApp: true} );
  }

  componentDidMount () {
    console.log('index.js page loaded');
    if(this.state.loading) this.setState({ loading: false });
    /*
      *** Attention Nick ***
        this is probably what we are going to want to use
        for routing once we have firebase auth hooked up
      *** Attention Nick ***
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
        } else {
          // User is signed out.
        }
      });
    */
  }

  render () {
    if (this.state.loading) {
      return (
        <main>
          Just a second...
          <Stylesheet sheet={sheet} />
        </main>
      )
    } else if (this.state.error) {
      return (
        <main>
          <h1>That""s bad. The following error occurred:</h1>
          <div className='error'>{this.state.error}</div>
          <Stylesheet sheet={sheet} />
        </main>
      )
    }

    if(this.state.inApp) {
      return (
        <HashRouter>
          <div>
            <App />
            <Stylesheet sheet={sheet} />
          </div>
        </HashRouter>
      );
    } else {
      return (
        <LoginRegister navToApp={this.navToApp}/>
      )
    }
  }
}

export default Index

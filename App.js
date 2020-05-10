import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation-stack'
import AuthNavigator from './src/screens/login/AuthNavigator'
import FriendList from './src/screens/FriendList'
import ChatRoom from './src/screens/chatRoom/ChatRoom'
import Home from './src/screens/Home'
import {createAppContainer } from 'react-navigation'
import firebaseConfig from './src/firebaseConfig/firebase'
import firebase from 'firebase'

import ChatNavigator from './src/screens/chatRoom/ChatNavigator'
require('firebase/firestore');
console.disableYellowBox=true;
YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};
// <=============== FIREBASE ===================>
firebase.initializeApp(firebaseConfig);


const db = firebase.firestore()
export const database = db;

// <=============== END FIREBASE ===================>

const navigator = createStackNavigator(
  {
    Auth: AuthNavigator,
    Home: Home,
    Chat: ChatNavigator
  },{
    initialRouteName: 'Auth',
    defaultNavigationOptions:{
      headerShown: false
    }
  }
);

export default createAppContainer(navigator);

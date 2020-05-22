import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation-stack'
import AuthNavigator from './src/screens/login/AuthNavigator'
import ChatRoom from './src/screens/chatRoom/ChatRoom'
import Home from './src/screens/Home'
import { YellowBox } from 'react-native'
import {createAppContainer } from 'react-navigation'
import firebaseConfig from './src/firebaseConfig/firebase'
import firebase from 'firebase'
import _ from 'lodash'
import FullScreenStory from './src/screens/FullScreenStory'

import ChatNavigator from './src/screens/chatRoom/ChatNavigator'
require('firebase/firestore');

console.disableYellowBox=true;
YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
_console.warn = message => {
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
    Home: {
      name: 'Home',
      screen: Home,
      navigationOptions: {
        gesturesEnabled: false
      }
    },
    Chat: ChatNavigator,
    FullScreenStory: FullScreenStory
  },{
    initialRouteName: 'Auth',
    defaultNavigationOptions:{
   
      header: null
  },
  
  }
  );

export default createAppContainer(navigator);

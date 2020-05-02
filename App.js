import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation-stack'
import AuthNavigator from './src/screens/login/AuthNavigator'
import Home from './src/screens/Home'
import {createAppContainer } from 'react-navigation'
import firebaseConfig from './src/firebaseConfig/firebase'
import firebase from 'firebase'
require('firebase/firestore');

// <=============== FIREBASE ===================>
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore()
export const database = db;

// <=============== END FIREBASE ===================>

const navigator = createStackNavigator(
  {
    Auth: AuthNavigator,
    Home: Home
  },{
    initialRouteName: 'Auth',
    defaultNavigationOptions:{
      header: null
    }
  }
);

export default createAppContainer(navigator);

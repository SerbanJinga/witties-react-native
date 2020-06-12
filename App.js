import React, { Component } from 'react';
import { createStackNavigator, CardStyleInterpolators } from 'react-navigation-stack'
import AuthNavigator from './src/screens/login/AuthNavigator'
import ChatRoom from './src/screens/chatRoom/ChatRoom'
import Home from './src/screens/Home'
import { YellowBox, Animated, Easing, Platform } from 'react-native'
import {createAppContainer, StackActions } from 'react-navigation'
import firebaseConfig from './src/firebaseConfig/firebase'
import firebase from 'firebase'
import _ from 'lodash'
import SearchUsers from './src/screens/friendSystem/SearchUsers'
import FullScreenStory from './src/screens/stories/FullScreenStory'

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

let CollapseExpand = (index, position) => {
  const inputRange = [index - 1, index, index + 1];
  const opacity = position.interpolate({
    inputRange,
    outputRange: [0, 1, 1],
  });

  const scaleY = position.interpolate({
    inputRange,
    outputRange: ([0, 1, 1]),
  });

  return {
    opacity,
    transform: [
      { scaleY }
    ]
  };
};

let SlideFromRight = (index, position, width) => {
  const inputRange = [index - 1, index, index + 1];
  const translateX = position.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [width, 0, 0]
  })
  const slideFromRight = { transform: [{ translateX }] }
  return slideFromRight
};

const TransitionConfiguration = () => {
  return {
    transitionSpec: {
      duration: 750,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true,
    },
    screenInterpolator: (sceneProps) => {
      const { layout, position, scene } = sceneProps;
      const width = layout.initWidth;
      const { index, route } = scene
      const params = route.params || {}; // <- That's new
      const transition = params.transition || 'default'; // <- That's new
      return {
        collapseExpand: CollapseExpand(index, position),
        default: SlideFromRight(index, position, width),
      }[transition];
    },
  }
}
const navigator = createStackNavigator(
  {
    Auth: AuthNavigator,
    Home: {
      name: 'Home',
      screen: Home,
     },
   
    Chat: ChatNavigator,
    FullScreenStory: {
      screen: FullScreenStory,
      name: 'Story',
    }
  },{
    initialRouteName: 'Auth',
    headerMode: null,
    navigationOptions: {
      cardStack: {
        gesturesEnabled: false
      },
      gesturesEnabled: false
    },
    gesturesEnabled: false,
    transitionConfig: TransitionConfiguration 
  
  }, 
  );

export default createAppContainer(navigator);

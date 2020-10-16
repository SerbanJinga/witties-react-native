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
import SendToList from './src/screens/camera/SendToList'
import UpdateScreen from './src/screens/UpdateScreen'
import ChatNavigator from './src/screens/chatRoom/ChatNavigator'
import Camera from './src/screens/camera/Camera';
import StreakVideoCamera from './src/screens/chatRoom/StreakVideoCamera';
import TestAnimation from './src/screens/stories/TestAnimation';
import { zoomIn, zoomOut } from 'react-navigation-transitions'
import ChatRoomPost from './src/screens/chatRoom/ChatRoomPost'
import ChatRoomPostDetail from './src/screens/chatRoom/ChatRoomPostDetail'
import { createSharedElementStackNavigator } from 'react-navigation-shared-element'
import ChatCameraScreen from './src/screens/chatRoom/ChatCameraScreen'
import SendTo from './src/screens/camera/SendTo';
import SendPhoto from './src/screens/chatRoom/SendPhoto';
import SendVideo from './src/screens/chatRoom/SendVideo';
import Timeline from './src/screens/Timeline/Timeline';
import StreakVideoAvatar from './src/screens/chatRoom/StreakVideoAvatar';
import Map from './src/screens/map/Map';
import ChooseProfilePicture from './src/screens/login/ChooseProfilePicture'
import TimelinePostDetail from './src/screens/Timeline/TimelinePostDetail'
import TutorialSlider from './src/screens/login/TutorialSlider'
import SeeAllFriends from './src/screens/friendSystem/SeeAllFriends'
import SeeAllChats from './src/screens/friendSystem/SeeAllChats'
import VideoComponent from './src/screens/chatRoom/VideoComponent'
import AsyncStorage from '@react-native-community/async-storage';

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

let SlideFromRight = (index, position, width) => {
  const translateX = position.interpolate({
    inputRange: [index - 1, index],
    outputRange: [width, 0],
  })

  return { transform: [ { translateX } ] }
};

let SlideFromBottom = (index, position, height) => {
  const translateY = position.interpolate({
    inputRange: [index - 1, index],
    outputRange: [height, 0],
  })

  return { transform: [ { translateY } ] }
};

let CollapseTransition = (index, position) => {
  const opacity = position.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [0, 1, 1]
  });

  const scaleY = position.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [0, 1, 1]
  });

  return {
    opacity,
    transform: [ { scaleY } ]
  }
}

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
      const height = layout.initHeight;
      const { index, route } = scene
      const params = route.params || {}; // <- That's new
      const transition = params.transition || 'default'; // <- That's new
      return {
        default: SlideFromRight(index, position, width),
        bottomTransition: SlideFromBottom(index, position, height),
        collapseTransition: CollapseTransition(index, position)
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
      navigationOptions:{
        gestureEnabled: false
      }
     },
   
    Chat: ChatNavigator,
    FullScreenStory: {
      screen: FullScreenStory,
      name: 'Story',
    },
    CameraScreen: Camera,
    StreakVideoCamera: StreakVideoCamera,
    TestAnimation: {
      name: 'TestAnimation',
      screen: TestAnimation,
      
    },
    ChatRoomPost: ChatRoomPost,
    ChatRoomPostDetail: ChatRoomPostDetail,
    ChatCameraScreen: ChatCameraScreen,
    SendToList: SendToList,
    SendPhoto: SendPhoto,
    SendVideo: SendVideo,
    Timeline: Timeline,
    StreakVideoAvatar: StreakVideoAvatar,
    ChooseProfilePicture: ChooseProfilePicture,
    Map: Map,
    TimelinePostDetail: TimelinePostDetail,
    TutorialSlider: TutorialSlider,
    SeeAllFriends: SeeAllFriends,
    SeeAllChats: SeeAllChats,
    VideoComponent: VideoComponent,
    UpdateScreen: UpdateScreen

  },{
    initialRouteName: 'Auth',
    headerMode: null,
  }, 
  );

export default createAppContainer(navigator);

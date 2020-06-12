import React, { Component } from 'react'
import { Text, Button, Input, Icon } from 'react-native-elements'
import { View, Dimensions, Vibration, Platform, Image, Slider, TouchableOpacity } from 'react-native'
import { Avatar, Header } from 'react-native-elements'
import * as firebase from 'firebase'
import Swiper from 'react-native-swiper'
import SearchUsers from '../screens/friendSystem/SearchUsers'
import * as Permissions from 'expo-permissions'
import { Notifications } from 'expo'
import * as ImagePicker from 'expo-image-picker'
import SwipeablePanel from "rn-swipeable-panel";
import ReceiveFriendRequest from '../screens/friendSystem/ReceiveFriendRequest'
import FriendList from '../screens/friendSystem/FriendList'
import ChatRoomsList from '../screens/chatRoom/ChatRoomsList' 
import UserProfile from '../screens/UserProfile'
import { ScrollView } from 'react-native-gesture-handler'
import Constants from 'expo-constants'
import ActivityPopup from '../screens/ActivityPop/ActivityPopup'
import Toast, { DURATION } from 'react-native-easy-toast'
import StoriesPublic from '../screens/stories/StoriesPublic'
import { Col, Row, Grid } from "react-native-easy-grid";
import ChannelStatus from '../components/ChannelStatus'
import Timeline from '../screens/Timeline/Timeline'
import PlacesInput from 'react-native-places-input';
import CameraScreen from '../screens/camera/Camera'
import { SafeAreaView } from 'react-native-safe-area-context'
const { width, height } = Dimensions.get('window')


export default class Home extends Component {



  constructor(props){
      super(props)
      this.state = {
        displayName: '',
        discriminator: '',
        expoPushToken: '',
        notification: {},
        profilePicture: ""
      }

    }

    

    componentDidMount = async() => {
      await this._getToken()
      await this._getProfilePicture()
      console.log(firebase.auth().currentUser.uid)
      console.log('se executa........')
    //  const func = await firebase.functions().httpsCallable('deletePost')
    //  func({timestamp: "1591718068140"}).then(console.log('a mers'))
  }


    _getProfilePicture = async() => {
      let initialQuery = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
      let documents = await initialQuery.get()
      let documentData = documents.data().profilePicture
      
      this.setState({
        profilePicture: documentData
      })

    }

    _getToken = async() => {
      let { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
      if(status !== 'granted'){
        console.log('n a mers')
      }

      let token = await Notifications.getExpoPushTokenAsync()

      console.log(token)

      firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({
        tokens: token
      })
    } 

    _signOut = () => {
      firebase.auth().signOut().then(this.props.navigation.navigate('Loading', {text: 'mama'}))
    }

    

    

    render(){
        return(

         <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
          <Swiper
                  loop={false}
                  showsPagination={false}
                  index={1}>
                    <View style={{flex: 1}}>
                      <CameraScreen/>
                    </View>
                    <Swiper
                      horizontal={false}
                      loop={false}
                      showsPagination={false}
                      index={1}>
                      <View style={{flex: 1}}>
                        <UserProfile/>
                      </View>
                      <View style={{flex: 1}}>
                        <SearchUsers/>
                      </View>
                    </Swiper>        
                    <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
                        <StoriesPublic/>
                       
                    </ScrollView>
       </Swiper>
</SafeAreaView>
          )

    }
}


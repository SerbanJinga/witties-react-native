import React, { Component } from 'react'
import { Text, Button, Input, Icon } from 'react-native-elements'
import { View, Dimensions, Vibration, Platform, Image, Slider, TouchableOpacity } from 'react-native'
import * as firebase from 'firebase'
import Swiper from 'react-native-swiper'
import HomeContainer from '../screens/containers/HomeContainer'
import TestContainer from '../screens/TestContainer'
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
import MessageComponent from '../screens/MapComponent'
import MapComponent from '../screens/MapComponent'
import Constants from 'expo-constants'
import Notification from '../screens/Notification'
import MediaDemo from '../screens/MediaDemo'
import ActivityPopup from '../screens/ActivityPop/ActivityPopup'
import Toast, { DURATION } from 'react-native-easy-toast'
import StoriesPublic from '../screens/StoriesPublic'
import { Col, Row, Grid } from "react-native-easy-grid";
import ChannelStatus from '../components/ChannelStatus'
import Timeline from '../screens/Timeline'
import PlacesInput from 'react-native-places-input';
import CameraScreen from '../screens/Camera'
import { Container, Content } from 'native-base'


const { width, height } = Dimensions.get('window')
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const homePlace = { description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } }};
const workPlace = { description: 'Work', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } }};

export default class Home extends Component {
  constructor(props){
      super(props)
      this.state = {
        displayName: '',
        discriminator: '',
        imageUri: '',
        imageURL: "",
        postText: "",
        expoPushToken: '',
        notification: {},
        swipeablePanelActive: false,
        outerScrollEnabled: true


      }

    }


    openPanel = () => {
      this.setState({ swipeablePanelActive: true });
    };
  
    closePanel = () => {
      this.setState({ swipeablePanelActive: false });
    };
  

  
    
    componentDidMount = () => {

      console.log(firebase.auth().currentUser.uid)
      console.log('se executa........')
    }


    da = async() => {
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

    uploadPhoto = async() => {
      const path = `photos/${firebase.auth().currentUser.uid}/${Date.now()}.jpg`
      const response = await fetch(this.state.imageUri)
      const file = await response.blob()

      let upload = firebase.storage().ref(path).put(file)
      upload.on("state_changed", snapshot => {}, err => {
        console.log(err)
      },
        async () => {
          const url = await upload.snapshot.ref.getDownloadURL()
          console.log(url)
          this.setState({imageURL: url})
        })
    }

    addPost = async() => {
      console.log('se executa')
      this.uploadPhoto()
      await firebase.firestore().collection("media")
        .add({
          uid: firebase.auth().currentUser.uid,
          timestamp: Date.now(),
          image: this.state.imageURL,
          text: this.state.postText
        }).then(
          console.log('a mers')
        ).catch(err => console.log(err))
    }

    pickImage = async() => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3]
      })

      if(!result.cancelled){
        this.setState({imageUri: result.uri})
      }

    }

    verticalScroll = (index) => {
      if (index !== 1) {
        this.setState({
          outerScrollEnabled: false
        })
      }
      else {
        this.setState({
          outerScrollEnabled: true
        })
      }
    }

 
   

    

    render(){
        return(
          // <CameraScreen/>
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
                      <View>
                        <UserProfile/>
                      </View>
                      <View>
                        <Timeline/>
                      </View>

                    <View>
                     
                       <Button
                        title="Send Notification"
                        style={{marginTop: 80}}
                        onPress={() => this.sendPushNotification()}
                      />
                       <Button
                        title="Send Notification"
                        style={{marginTop: 80}}
                        onPress={() => this._signOut()}
                      />
                    </View>
                    </Swiper>        
                    <ScrollView style={{backgroundColor: '#fff', flex: 1}}>
                      <StoriesPublic/>
                      <ChannelStatus/>
                      <ChannelStatus/>
                      <ChannelStatus/>

                    </ScrollView>
       </Swiper>
    //   SLIDER CARE MERGE
          // <Button title="da" onPress={this._signOut()}/>
          // <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
          //   <StoriesPublic/>
          //   <ChannelStatus/>
          //   <ChannelStatus/>
          //   <ChannelStatus/>

          //   </ScrollView>
          
          )

    }
}

import React, { Component } from 'react'
import { Text, Button, Input } from 'react-native-elements'
import { View, Dimensions, Vibration, Platform, Image, Slider, TouchableOpacity } from 'react-native'
import * as firebase from 'firebase'
import Swiper from 'react-native-swiper'
import HomeContainer from '../screens/containers/HomeContainer'
import TestContainer from '../screens/TestContainer'
import SearchUsers from '../screens/friendSystem/SearchUsers'
import * as Permissions from 'expo-permissions'
import { Notifications } from 'expo'
import * as ImagePicker from 'expo-image-picker'
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
import CameraScreen from './Camera'
import ActivityPopup from '../screens/ActivityPop/ActivityPopup'
const { width, height } = Dimensions.get('window')
const delay = (ms) => new Promise((res) => setTimeout(res, ms));


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
        cameraPermission: false
      }

    }

    requestCamera = async () => {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      if(status === 'granted'){
        this.setState({cameraPermission: true })
      }else{
        alert('hai suge-o')
      }
    }
    
    componentDidMount = () => {
      console.log(firebase.auth().currentUser.uid)
      this.requestCamera()
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

   

  

  


 
   

    

    render(){
        return(
      //          <Swiper
      //             loop={false}
      //             showsPagination={false}
      //             index={1}>
      //               <View>
      //                 <FriendList/>
      //               </View>
      //               <Swiper
      //                 horizontal={false}
      //                 loop={false}
      //                 showsPagination={false}
      //                 index={1}>
      //                 <View>
      //                   <ReceiveFriendRequest/>
      //                 </View>
      //                 <View>
      //                   <SearchUsers/>
      //                 </View>

      //               <View>
                     
      //                  <Button
      //                   title="Send Notification"
      //                   style={{marginTop: 80}}
      //                   onPress={() => this.sendPushNotification()}
      //                 />
      //                  <Button
      //                   title="Send Notification"
      //                   style={{marginTop: 80}}
      //                   onPress={() => this._signOut()}
      //                 />
      //               </View>
      //               </Swiper>        
      //               <View>
      //                 <ChatRoomsList/>
      //               </View>
      // </Swiper>
        <View>
          {/* <UserProfile/> */}
          <Button
            title="Send Notification"
            style={{marginTop: 80}}
            onPress={() => this._signOut()}
          />
        </View>
      )
    }
}

import React, { Component } from 'react'
import { Text, Button, Input } from 'react-native-elements'
import { View, Dimensions, Vibration, Platform, Image, Slider } from 'react-native'
import firebase from 'firebase'
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
const { width, height } = Dimensions.get('window')
require('firebase/functions')
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
        notification: {}
      }

    }

    
    componentDidMount(){
      const { data } = firebase.functions().httpsCallable('listProducts')({
        page: 1, 
        limit: 14
      })

      console.log(data)
    }

    _handleNotification = notification => {
      Vibration.vibrate();
      this.setState({ notification: notification });
    };
  
    sendPushNotification = async () => {
      const message = {
        to: this.state.expoPushToken,
        sound: 'default',
        title: 'Original Title',
        body: 'And here is the body!',
        data: { data: 'goes here' },
        _displayInForeground: true,
      };
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
    };

    async waitAndMakeRequest(update_rate) {
      this.retrieveData()
      await delay(update_rate).then(() => {

          this.waitAndMakeRequest(update_rate);}

      )
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
      //                   onPress={() => this.props.navigation.navigate('ChatRoom')}
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
          <ScrollView>
            <UserProfile/>
            <Button
              style={{marginTop: 20}}
              title="Sign Out"
              onPress={this._signOut}
            />
          </ScrollView>
        )
    }
}


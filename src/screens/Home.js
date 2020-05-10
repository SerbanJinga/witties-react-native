import React, { Component } from 'react'
import { Text, Button, Input } from 'react-native-elements'
import { View, Dimensions, Vibration, Platform, Image, Slider } from 'react-native'
import firebase from 'firebase'
import Swiper from 'react-native-swiper'
import HomeContainer from '../screens/containers/HomeContainer'
import TestContainer from '../screens/TestContainer'
import SearchUsers from '../screens/SearchUsers'
import Constants from 'expo-constants'
import * as Permissions from 'expo-permissions'
import { Notifications } from 'expo'
import * as ImagePicker from 'expo-image-picker'
import ReceiveFriendRequest from '../screens/ReceiveFriendRequest'
import FriendList from '../screens/FriendList'
import ChatRoomsList from '../screens/chatRoom/ChatRoomsList' 
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

    registerForPushNotificationsAsync = async () => {
      if (Constants.isDevice) {
        const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          alert('Failed to get push token for push notification!');
          return;
        }
        token = await Notifications.getExpoPushTokenAsync();
        this.setState({ expoPushToken: token });
      } else {
        alert('Must use physical device for Push Notifications');
      }
  
      if (Platform.OS === 'android') {
        Notifications.createChannelAndroidAsync('default', {
          name: 'default',
          sound: true,
          priority: 'max',
          vibrate: [0, 250, 250, 250],
        });
      }
    };

    componentDidMount(){
      this.getPhotoPermission()
      this.registerForPushNotificationsAsync()
      this._notificationSubscription = Notifications.addListener(this._handleNotification)
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

   

  

  
  getPhotoPermission = async() => {
    if(Constants.platform.android || Constants.platform.ios){
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if(status != "granted"){
        alert("We need permission to access your camera roll.")
      }
    }
  }

 
   

    

    render(){
        return(
               <Swiper
                  loop={false}
                  showsPagination={false}
                  index={1}>
                    <View>
                      <FriendList/>
                    </View>
                    <Swiper
                      horizontal={false}
                      loop={false}
                      showsPagination={false}
                      index={1}>
                      <View>
                        <ReceiveFriendRequest/>
                      </View>
                      <View>
                        <SearchUsers/>
                      </View>

                    <View>
                     
                       <Button
                        title="Send Notification"
                        style={{marginTop: 80}}
                        onPress={() => this.props.navigation.navigate('ChatRoom')}
                      />
                       <Button
                        title="Send Notification"
                        style={{marginTop: 80}}
                        onPress={() => this._signOut()}
                      />
                    </View>
                    </Swiper>        
                    <View>
                      <ChatRoomsList/>
                    </View>
      </Swiper>
      
        )
    }
}


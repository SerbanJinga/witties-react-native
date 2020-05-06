import React, { Component } from 'react'
import { Text, Button, Input } from 'react-native-elements'
import { View, Dimensions, StyleSheet, ScrollView, Image, Slider } from 'react-native'
import firebase from 'firebase'
import Swiper from 'react-native-swiper'
import HomeContainer from '../screens/containers/HomeContainer'
import TestContainer from '../screens/TestContainer'
import SearchUsers from '../screens/SearchUsers'
import Constants from 'expo-constants'
import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'
import FriendRequest from '../screens/FriendRequests'
import ReceiveFriendRequest from '../screens/ReceiveFriendRequest'
import FriendList from '../screens/FriendList'
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
        postText: ""
      }

    }
    async waitAndMakeRequest(update_rate) {
      console.log('update')
      this.retrieveData()
      await delay(update_rate).then(() => {

          this.waitAndMakeRequest(update_rate);}

      )
  }





    _signOut = () => {
      firebase.auth().signOut().then(this.props.navigation.navigate('Loading'))
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
      await firebase.firestore().collection("posts")
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

   componentDidMount(){
      this.getPhotoPermission()
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
                        title="Sign Out"
                        style={{marginTop: 40}}
                        onPress={this._signOut}
                      />
                    </View>
                    </Swiper>        
                    <View>
                        <Text>Right</Text>
                    </View>
      </Swiper>
     
            
        )
    }
}


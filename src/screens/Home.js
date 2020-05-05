import React, { Component } from 'react'
import { Text, Button, Input } from 'react-native-elements'
import { View, Dimensions, StyleSheet, ScrollView, Image } from 'react-native'
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
const { width, height } = Dimensions.get('window')


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
            <View>
              <Button
                onPress = {this._signOut}
                style={{marginTop: 80}}
                title="Sign Out"
              />
              {/* <Button
                title="Galerie"
                onPress={this.pickImage}
              />
              <Button
                title="Posteaza"
                onPress={this.addPost}
              />
              <Input
                onChangeText={postText => this.setState({postText})}
                value={this.state.postText}
                style={{marginTop: 20}}
                placeholder="Introdu textul"
              /> */}

              <ReceiveFriendRequest/>
              {/* <View style={{marginHorizontal: 32, marginTop: 32, height: 150}}>
              <Image source={{uri: this.state.imageUri}} style={{width: "100%", height: "100%"}}></Image>
              </View> */}
            </View>
            
        )
    }
}


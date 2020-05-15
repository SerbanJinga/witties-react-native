import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, Button, Image } from 'react-native'
import { Input } from 'react-native-elements'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'
import firebase from 'firebase'
const { width, height } = Dimensions.get('window')

export default class MediaDemo extends Component{
    constructor(props){
        super(props)
        this.state = {
            text: "",
            imageUri: "",
            postText: "",
            imageUrl: ""
        }
    }

    componentDidMount() {

    }

    getRndInteger = (min, max) => {
        return (Math.floor(Math.random() * (max - min + 1) ) + min) * 16;
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
  

    addPost = async() => {
        const location = {
            "lat": this.getRndInteger(1, 10),
            "lng": this.getRndInteger(1, 10)
        }
        console.log('se executa')
        this.uploadPhoto()
        await firebase.firestore().collection("media")
          .add({
            uid: firebase.auth().currentUser.uid,
            timestamp: Date.now(),
            image: this.state.imageUrl,
            text: this.state.postText,
            location: location
          }).then(
            console.log('a mers')
          ).catch(err => console.log(err))
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
            this.setState({imageUrl: url})
          })
      }

    render(){
        return(
            <View style={styles.container}>
                
                <Image
                    source={{uri: this.state.imageUri}}
                    style={{width: 200, height: 200}}
                />
                <Button
                    title="Upload image from image"
                    onPress={this.pickImage}
                    
                />
                <Button
                    title="Add Post"
                    onPress={this.addPost}
                />
                <Input
                    textContentType="text"
                    placeholder="Post"
                    value={this.state.postText}
                    onChangeText={postText => this.setState({ postText })}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height
    }
})
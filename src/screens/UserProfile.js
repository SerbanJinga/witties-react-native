import React, { Component } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { Input, Text, Button, Avatar, Overlay } from 'react-native-elements'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'
import firebase from 'firebase'
import { withNavigation } from 'react-navigation'
const { width, height } = Dimensions.get('window')

 export default class UserProfile extends Component {
    constructor(props){
        super(props)
        this.state = {
            imageURL: "",
            imageUri: "",
            optionMenu: false,
            userData: {}
        }
    }

    _retrieveUserData = async() => {
        const currentId = firebase.auth().currentUser.uid
        let userQuery = await firebase.firestore().collection('users').doc(currentId)
        let userSnapshots = await userQuery.get()
        let userData = userSnapshots.data()
        this.setState({
            userData: userData
        })
        console.log(this.state.userData)
    }

    componentDidMount = () => {
        this._retrieveUserData()
        this._retrieveImage()
    }

    _openOptions = () => {
        this.setState({
            optionMenu: !this.state.optionMenu
        })
    }
    

    _pickImage = async() => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3]
        })

        if(!result.cancelled){
            this.setState({
                imageUri: result.uri
            })
            this._uploadToStorage()
        }
    }

_retrieveImage = async() => {
    const path = `profiles_picture/${firebase.auth().currentUser.uid}`
    const url = await firebase.storage().ref(path).getDownloadURL()
    this.setState({imageUri: url})
}

_uploadToStorage = async () => {
    const path = `profiles_picture/${firebase.auth().currentUser.uid}`
    const response = await fetch(this.state.imageUri)
    const file = await response.blob()

    let upload = firebase.storage().ref(path).put(file)
    upload.on("state_changed", snapshot => {}, err => {
        console.log(err)
    },
    async () => {
        const url = await upload.snapshot.ref.getDownloadURL()
        console.log(url)
        this.setState({imageUri: url})
        this._uploadToFirestore(url)
    })
}

_uploadToFirestore = (url) => {
    firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({
        profilePicture: url
    })
}

_deletePicture = () => {
    alert("ai ales")
}


    render(){
        return(
            <View style={{width: width, height: height * 0.8, marginTop: 40}}>

                <Avatar
                    containerStyle={{marginTop: 20, marginLeft: 120}}
                    size="xlarge"
                    rounded
                    source={{
                        uri: this.state.imageUri
                    }}
                    onPress={() => this._openOptions()}
                />
                <Text style={{marginTop: 20, marginLeft: 140}}>{this.state.userData.displayName}#{this.state.userData.discriminator}</Text>
                <Text style={{marginTop: 20, marginLeft: 140}}>Profile Picture url: {this.state.userData.profilePicture}</Text>
                <Text style={{marginTop: 20, marginLeft: 140}}>Care Score: {this.state.userData.careScore}</Text>
                <Text style={{marginTop: 20, marginLeft: 140}}>Email  {this.state.userData.email}</Text>
                
                
                <Overlay onBackdropPress={this._openOptions} isVisible={this.state.optionMenu}>
                    <View>
                        <Button
                            onPress = {this._deletePicture}
                            type="clear"
                            title="Delete picture"
                        />
                        <Button
                            onPress={this._pickImage}
                            type="clear"
                            title="Select picture"
                        />
                    </View>
                </Overlay>
        
            </View>
        )
    }
}


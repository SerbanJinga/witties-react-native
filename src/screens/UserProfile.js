import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native'
import { Text, Button, Avatar, Overlay, SearchBar, Divider } from 'react-native-elements'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'
import firebase from 'firebase'
import { Entypo, AntDesign } from '@expo/vector-icons'
import * as Font from 'expo-font'
import { withNavigation } from 'react-navigation'
import { ScrollView, FlatList } from 'react-native-gesture-handler'
import AddFriend from '../screens/friendSystem/AddFriend'
import Friend from '../components/Friend'
import ReceiveFriend from '../screens/friendSystem/ReceiveFriend'
import ReceiveFriendRequest from './friendSystem/ReceiveFriendRequest'
import FriendList from './friendSystem/FriendList'
import AllFriends from './friendSystem/AllFriends'
let arr = []
let friendsArr = []
const { width, height } = Dimensions.get('window')

 export default class UserProfile extends Component {
    constructor(props){
        super(props)
        this.state = {
            imageURL: "",
            imageUri: "",
            optionMenu: false,
            userData: {},
            fontsLoaded: false,
            friends: [],
            friendsNumber: 0,
            friendsOverlay: false,
            settings: false
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

    componentDidMount = async () => {
        arr = []
        friendsArr = []
        this._retrieveUserData()
        this._retrieveImage()
        await this._retrieveAllFriends()
        await Font.loadAsync({
            font1: require('../../assets/SourceSansPro-Black.ttf')
        });
        this.setState({fontsLoaded: true})
        this.retrieveHowManyFriends()
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


_retrieveAllFriends = async() => {
    let initialQuery = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
    let documentSnapshots = await initialQuery.get()
    let documentData = documentSnapshots.data().friends
    documentData.forEach(doc => this._getFriendDetailsFromUid(doc))

}

_getFriendDetailsFromUid = async(uid) => {
    let initialQuery = firebase.firestore().collection('users').where("uid", '==', uid)
    let documentSnapshots = await initialQuery.get()
    documentSnapshots.docs.map(doc => friendsArr.push(doc.data()))
    this.setState({friends: friendsArr})
    // console.log(this.state.friends)
}

retrieveHowManyFriends = () =>{
   
}


openFriends = () => {
    this.setState({
        friendsOverlay: true
    })
}

closeFriends = () => {
    this.setState({
        friendsOverlay: false
    })
}
    render(){
        if(this.state.fontsLoaded){return(
            <View style={{backgroundColor: '#fff', width: width, height: height, marginTop: 20, flex: 1, flexDirection: 'column'}}>
                 
                <View style={{flex: 0, flexDirection: 'column', alignItems: 'center'}}>
                   
                <Avatar
                    containerStyle={{marginTop: 20, marginLeft: 0}}
                    size="xlarge"
                    rounded
                    source={{
                        uri: this.state.imageUri
                    }}
                    onPress={() => this._openOptions()}
                />
                <View style={{flex: 0, flexDirection: 'row', marginTop: 20}}>
                <Text style={{fontFamily: "font1", fontSize: 15}}>{this.state.userData.displayName}#{this.state.userData.discriminator}</Text>
                <Entypo name="dot-single" style={{marginTop: 4, marginHorizontal: 4}}/>
                <Text style={{fontFamily: "font1", fontSize: 15}}>{this.state.userData.careScore}</Text>
                </View>
                <TouchableOpacity onPress={() => this.openFriends()}>
                    <Text style={{fontFamily: "font1", fontSize: 15}}>{this.state.friends.length} Friends</Text>
                </TouchableOpacity>
                </View>
                <View style={{flex: 1, flexDirection: 'column', marginTop: 20}}>
                <Divider style={{width: width}}/>

                <Text style={{fontFamily: "font1", fontSize: 15, marginTop: 10, marginLeft: 10}}>News</Text>
                <AllFriends/>
                
                </View>

                <Overlay animationType="slide" onBackdropPress={() => this.closeFriends()} fullScreen isVisible={this.state.friendsOverlay}>
                <View style={{flex: 1}}>
                    <FriendList close={() => this.closeFriends()}/>
                </View>
                </Overlay>
                <Overlay onBackdropPress={this._openOptions} isVisible={this.state.optionMenu} overlayStyle={{position: 'absolute', bottom: 0, width: width}}>
                    <View>
                        
                        <Button
                            onPress={this._pickImage}
                            type="clear"
                            title="Select picture"
                            titleStyle={{color: '#000', fontFamily: "font1"}}

                        />
                        <Divider/>
                        <Button
                            titleStyle={{color: 'red', fontFamily: "font1"}}
                            onPress = {this._deletePicture}
                            type="clear"
                            title="Delete picture"
                        />
                    </View>
                </Overlay>
                
            </View>
        )}else{
            return(
                <ActivityIndicator size="large"/>
            )
        }
    }
}


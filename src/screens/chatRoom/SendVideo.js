import React, { Component } from 'react'
import { View, TouchableOpacity, Dimensions } from 'react-native'
import { Input, Avatar } from 'react-native-elements'
import { Video } from 'expo-av'
import { AntDesign } from '@expo/vector-icons'
import { withNavigation } from 'react-navigation'
import { SafeAreaView } from 'react-native-safe-area-context'
const { width, height } = Dimensions.get('window')
import firebase from 'firebase'

class SendVideo extends Component{
    constructor(props){
        super(props)
        this.state = {
            uri: props.navigation.state.params.video,
            chatRoomDisplayPhoto: props.navigation.state.params.chatRoomPhoto,
            roomId: props.navigation.state.params.chatRoomId,
            videoUri: "",
            currentMessage: ""
        }
    }

    uploadVideo = async() => {
        const timestamp = firebase.auth().currentUser.uid + "/" + Date.now()
        const path = `${this.state.roomId}/${timestamp}`
        const response = await fetch(this.state.uri)
        const file = await response.blob()
        let upload = firebase.storage().ref(path).put(file)
        upload.on("state_changed", snapshot => {}, err => {

        }, async () => {
            const url = await upload.snapshot.ref.getDownloadURL()
            this.setState({
                videoUri: url
            })
            this.sendToChat()
        })
    }

    sendToChat = async () => {
        let foo = {
            mood: "",
            text: this.state.currentMessage,
            activity: "",
            video: this.state.videoUri,
            timestamp: Date.now(),
            hoursPosted: "",
            location: "",
            creatorId: firebase.auth().currentUser.uid,
            taggedUsers: [],
            albums: []
        }

        await firebase.firestore().collection('messages').doc(this.state.roomId).collection('chats').add({
            mood: "",
            text: this.state.currentMessage,
            activity: "",
            video: this.state.videoUri,
            timestamp: Date.now(),
            hoursPosted: "",
            location: "",
            creatorId: firebase.auth().currentUser.uid,
            taggedUsers: [],
            albums: []
        }).then(() => this.props.navigation.goBack(null))
    }

    render(){
        return(
            <SafeAreaView style={{flex: 1}}>
            <View style={{flex: 1}}>
            <View style={{flex: 0, flexDirection: 'row', justifyContent: 'space-between', padding: 10, alignItems: 'center'}}>
                <TouchableOpacity
                    onPress={() => this.props.navigation.goBack(null)}
                  style={{
                    backgroundColor: 'transparent',
                 }}>
              <AntDesign
                color="#fff"
                  name="arrowleft"
                  style={{fontSize: 24, fontWeight: "bold", shadowColor: '#000', elevation: 4, shadowOffset: {width: 2, height: 2}, shadowOpacity: 0.6,
                  shadowRadius: 3.84,
}}
              />
                          </TouchableOpacity> 
                          {/* <Text style={{fontSize: 20, fontFamily: "font1", paddingTop: 0}}>{this.state.roomName}</Text> */}

                    <Avatar onPress={() => console.log('dda')} rounded source={{uri: this.state.chatRoomDisplayPhoto}} containerStyle={{marginLeft: 20}}/>
                    
                
                </View>
            <Video resizeMode="cover" shouldPlay isMuted={false} rate={1.0} volume={1.0} isLooping source={{uri: this.state.uri}} style={{width: width, height: height}}/>

            <View style={{flex: 0, backgroundColor: '#000', flexDirection: 'row', justifyContent: 'space-around', padding: 10, alignItems: 'center',  bottom: 0, position: 'absolute'}}>
                
                <Input
                    
                    placeholderTextColor="#B1B1B1"
                    returnKeyType="done"
                
                    containerStyle={{bottom:0}}
                    inputContainerStyle={{ paddingHorizontal: 10, borderWidth: 1, borderColor: "#b2b8c2",borderRadius: 20, height: 44, backgroundColor: '#fff'}}
                    value={this.state.currentMessage}
                    onChangeText={currentMessage => this.setState({ currentMessage: currentMessage })}
                    renderErrorMessage={false}
                />
                <TouchableOpacity
                    onPress={() => this.uploadVideo()}
                  style={{
                    backgroundColor: 'transparent',
                 }}>
              <AntDesign
                color="#0984e3"
                  name="arrowright"
                  style={{fontSize: 34, fontWeight: "bold", shadowColor: '#000', elevation: 4, shadowOffset: {width: 2, height: 2}, shadowOpacity: 0.6,
                  shadowRadius: 3.84,
}}
              />
                          </TouchableOpacity> 
                    
                
                </View>
                </View>

            </SafeAreaView>
        )
    }
}

export default withNavigation(SendVideo)
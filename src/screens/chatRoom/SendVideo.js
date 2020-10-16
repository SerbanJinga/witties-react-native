import React, { Component } from 'react'
import { View, TouchableOpacity, Dimensions } from 'react-native'
import { Input, Avatar, Text } from 'react-native-elements'
import { Video } from 'expo-av'
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
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
            this.props.navigation.goBack(null)
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
        })
    }

    render(){
        return(
            <SafeAreaView style={{flex: 1, backgroundColor: '#000'}}>
            <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-between', padding: 10, alignItems: 'center', backgroundColor: '#000' }}>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.goBack(null)}
                            style={{
                                backgroundColor: 'transparent',
                                // margin: 4,
                                // marginRight: 10,
                            }}>
                            <AntDesign
                                name="arrowleft"
                                style={{ fontSize: 24, fontWeight: "bold" }}
                                color="#fff"
                            />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 20, fontFamily: "font1", paddingTop: 0, color: '#fff' }}>Sending To {this.state.roomName}</Text>

                        <Avatar onPress={() => console.log('da')} rounded source={{ uri: this.state.chatRoomDisplayPhoto }} />


                    </View>
            <Video resizeMode="contain" shouldPlay isMuted={false} rate={1.0} volume={1.0} isLooping source={{uri: this.state.uri}} style={{width: width, height: height / 1.2}}/>
            <View style={{flex: 0, flexDirection: 'row', justifyContent: 'space-between', padding: 0, alignItems: 'center', backgroundColor: '#000', position: 'absolute', bottom: 20}}>
               
               <Input
                    
                    placeholderTextColor="#B1B1B1"
                    returnKeyType="done"
                        placeholder="Add a caption..."
                    containerStyle={{bottom:0, width: width / 1.2}}
                    inputContainerStyle={{ paddingHorizontal: 10, borderWidth: 1, borderColor: "#b2b8c2",borderRadius: 20, height: 40, backgroundColor: '#fff'}}
                    value={this.state.currentMessage}
                    onChangeText={currentMessage => this.setState({ currentMessage: currentMessage })}
                    renderErrorMessage={false}
                /> 
                    

                      <TouchableOpacity
                    onPress={() => this.uploadVideo()}
                 >
                    <MaterialCommunityIcons name="send-circle" size={48} color="#0984e3"/>

                          </TouchableOpacity> 
                          
               </View>

            </SafeAreaView>
        )
    }
}

export default withNavigation(SendVideo)
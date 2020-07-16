import React, { Component } from 'react'
import { View, Dimensions, TouchableOpacity, ImageBackground } from 'react-native'
import { Image, Avatar, Input } from 'react-native-elements'
import { withNavigation } from 'react-navigation'
import { AntDesign } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
const { width, height } = Dimensions.get('window')
import firebase from 'firebase'
class SendPhoto extends Component {
    constructor(props){
        super(props)
        this.state = {
            uri: props.navigation.state.params.photo,
            chatRoomDisplayPhoto: props.navigation.state.params.chatRoomPhoto,
            roomId: props.navigation.state.params.chatRoomId,
            // width: props.navigation.state.params.width,
            // height: props.navigation.state.params.height,
            currentMessage: "",
            imageUri: ""
        }
    }

    uploadPhoto = async() => {
        const timestamp = firebase.auth().currentUser.uid + "/" + Date.now()
        const path = `${this.state.roomId}/${timestamp}`
        const response = await fetch(this.state.uri)
        const file = await response.blob()
        let upload = firebase.storage().ref(path).put(file)
        upload.on("state_changed", snapshot => {}, err => {

        }, async () => {
            const url = await upload.snapshot.ref.getDownloadURL()
            this.setState({
                imageUri: url
            })
            this.sendToChat()
        })
    }

    sendToChat = async () => {
        let foo = {
            mood: "",
            text: this.state.currentMessage,
            activity: "",
            image: this.state.imageUri,
            timestamp: Date.now(),
            hoursPosted: "",
            location: "",
            creatorId: firebase.auth().currentUser.uid,
            taggedUsers: [],
            albums: []
        }
        await firebase.firestore().collection('messages').doc(this.state.roomId).collection('chats').add({
            // messages: firebase.firestore.FieldValue.arrayUnion(foo)
            mood: "",
            text: this.state.currentMessage,
            activity: "",
            image: this.state.imageUri,
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
            {/* <ImageBackground source={{uri: this.state.uri}} style={{width: width, height: height, flex: 1}}> */}
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
                <Image source={{uri: this.state.uri}} style={{width: width, height: height}}/>
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
                    onPress={() => this.uploadPhoto()}
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
                {/* <Image source={{uri: this.state.uri}} style={{width: this.state.width, height: this.state.height}}/> */}
                {/* </ImageBackground> */}
                </SafeAreaView>
        )
    }
}

export default withNavigation(SendPhoto)
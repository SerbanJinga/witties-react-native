import React, { Component } from 'react'
import { View, Dimensions, TouchableOpacity, ImageBackground } from 'react-native'
import { Image, Avatar, Input, Text, Divider } from 'react-native-elements'
import { withNavigation } from 'react-navigation'
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
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
            roomName: props.navigation.state.params.chatRoomName,
            width: props.navigation.state.params.width,
            height: props.navigation.state.params.height,
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
            msg: this.state.currentMessage,
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
            msg: this.state.currentMessage,
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
            <SafeAreaView style={{flex: 1, backgroundColor: '#000'}}>
            {/* <View style={{flex: 1}}> */}
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
                <Image source={{uri: this.state.uri}} style={{width: width, height: height / 1.5, resizeMode: 'contain', top: 0}}/>
               
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
                    onPress={() => this.uploadPhoto()}
                 >
                    <MaterialCommunityIcons name="send-circle" size={48} color="#0984e3"/>

                          </TouchableOpacity> 
                          
               </View>
                </SafeAreaView>
        )
    }
}

export default withNavigation(SendPhoto)
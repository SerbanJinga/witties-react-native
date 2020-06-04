import React, { Component } from 'react'
import { Text, Input, Button, Icon, Divider, Avatar , Overlay} from 'react-native-elements'
import { Platform, KeyboardAvoidingView, View, StyleSheet, Dimensions, FlatList, Keyboard, TouchableWithoutFeedback, ScrollView, TouchableOpacity } from 'react-native'
import MessageComponent from '../chatRoom/MessageComponent'
import firebase from 'firebase'
import { MaterialIcons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons'
import _ from "lodash"
import * as ImagePicker from 'expo-image-picker'

import { withNavigation } from 'react-navigation'
import ChatRoomPost from './ChatRoomPost'
import ChatParticipant from './ChatParticipant'
let arr = []
const self = this;
let userDataArray = []
require('firebase/functions')
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const { width, height } = Dimensions.get('window')
const { width2, height2 } = Dimensions.get("screen")
import SwipeablePanel from "rn-swipeable-panel";

class ChatRoom extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //tu esti 
            currentUser: firebase.auth().currentUser.uid,
            //cu asta vorbesti acum 
            roomId: props.navigation.state.params.roomId,
            profilePicture: props.navigation.state.params.profilePicture,

            // roomId: 'qqKiPxB3zeFZA6Uhsd2B',
            roomName: props.navigation.state.params.iqdif,
            userId: "",
            messages: [],
            currentMessage: '',
            changeChatOverlay: false,
            usersParticipating: [],
            userData: [],
            changePhoto: false,
            imageUri: '',
            chatSettings: false,
            lessMessages: []
        }
    }

    _onTouchAvatar = () => {
        this.setState({
            changeChatOverlay: true
        })
    }



    createMessage = (message) => {
        const timestamp = Date.now()
        const msg = message
        const sender = this.state.currentUser

        const newMessage = {
            timestamp: timestamp,
            msg: msg,
            sender: firebase.auth().currentUser.uid
        }
        //Adauga pe ecran instant
        let aru = []
        aru = this.state.messages
        aru.push(newMessage)
        this.setState({ message: aru })



        //seteaza in baza de date
        firebase.firestore().collection("messages").doc(this.state.roomId).update({
            messages: firebase.firestore.FieldValue.arrayUnion(newMessage)
        })
    }
    _renderTimestamps = (timestamp) => {
        let date = new Date(timestamp * 1000)
        let day = date.getDay()
        let month = date.getMonth() + 1
        let year = date.getUTCFullYear()
        return day + ":" + month + ":" + year


    }

    componentDidMount = async()=> {
        userDataArray = []
        await this.retrieveParticipants()

        await this.retrieveData()
    }

    renderHeader() {
        return (<View>
            <Text>TIMELINE</Text>
            <Divider />
        </View>)
    }

    _closeChatDetails = () => {
        this.setState({
            changeChatOverlay: false
        })
    }

    retrieveParticipants = async() => {
        let initalQuery = firebase.firestore().collection('messages').doc(this.state.roomId)
        let initalSnapshot = await initalQuery.get()
        let initialData = initalSnapshot.data().usersParticipating
        console.log('<=========================================>')
        console.log(initialData)
        console.log(this.state.roomId)
        console.log('<=========================================>')

        initialData.forEach(user => this.retrieveParticipantDetail(user))
    }
    retrieveParticipantDetail = async(uid) => {
        let userQuery = firebase.firestore().collection('users').doc(uid)
        let userSnapshot = await userQuery.get()
        let userData = userSnapshot.data()
        userDataArray.push(userData)
        this.setState({
            userData: userDataArray
        })
        console.log('DATATETETATTTE')
        console.log(this.state.userData)
    }


    retrieveData = async () => {
       
        let arrMsg = []
        let receivedQuery = await firebase.firestore().collection("messages").doc(this.state.roomId)
        let receivedSnapshots = await receivedQuery.get()
        let receivedData = receivedSnapshots.data().messages.slice(-6)
        receivedData.forEach(element => {
            arrMsg.push(element)
        })
        arrMsg.reverse()

        
        console.log('DAIFJAFJKAFJAKFJk')
        arrMsg.slice().sort((a, b) => a.timestamp - b.timestamp)
        this.setState({
            messages: arrMsg,
        })
        console.log(this.state.messages)
    }

    retrieveMore = async () => {
        let howManyLoadInPlus = 6
        let arrMsg = []
        let receivedQuery = await firebase.firestore().collection("messages").doc(this.state.roomId)
        let receivedSnapshots = await receivedQuery.get()
        let receivedData = receivedSnapshots.data().messages.slice(-6 + howManyLoadInPlus)
        receivedData.forEach(element => {
            arrMsg.push(element)
        })
        arrMsg.reverse()

        
        console.log('DAIFJAFJKAFJAKFJk')
        arrMsg.slice().sort((a, b) => a.timestamp - b.timestamp)
        this.setState({
            messages: arrMsg,
        })

    }

    renderParticipants = () => {
        
        return(
            
                <FlatList                        
                    
                    data={this.state.userData}
                    renderItem={({ item }) => (
                        <ChatParticipant displayName={item.displayName} profilePicture={item.profilePicture} discriminator={item.discriminator} mood={item.status.mood}/>
                    )}
                    keyExtractor={(item, index) => String(index)}
                />                
        )
    }
    _retrieveImage = async() => {
        const path = `messages/profile-picture/${this.state.roomId}`
        const url = await firebase.storage().ref(path).getDownloadURL()
        this.setState({imageUri: url})
    }

    changePhoto = async() => {
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
    _uploadToStorage = async () => {
        const path = `messages/profile-picture/${this.state.roomId}`
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
        firebase.firestore().collection("messages").doc(this.state.roomId).update({
            profilePicture: url
        })
    }

    _openGroupSettings = () => {
        this.setState({
            chatSettings: true
        })
    }
    _closeChatSettings = () => {
        this.setState({
            chatSettings: false
        })
    }
    
    render() {
        return (
            <View style={styles.container}>
           
            <Overlay overlayStyle={{width: width, height: height}} isVisible={this.state.changeChatOverlay} animationType="slide">
            <View style={{flex: 1}}>
                <View style={{flex: 0, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <TouchableOpacity onPress={() => this._closeChatDetails()}>
                    <AntDesign
                        size={26}
                        name="down"
                        color="#b2b8c2"
                    />
                    </TouchableOpacity>
                    <Text style={{fontFamily: 'font1', fontSize: 20}}>{this.state.roomName}</Text>
                    <TouchableOpacity onPress={() => this._openGroupSettings()}>
                    <AntDesign
                        size={26}
                        name="bars"
                        color="#b2b8c2"
                    />
                    </TouchableOpacity>
                </View>
                <View style={{flex: 0, alignItems: 'center', marginTop: 40}}>
                    <Avatar size={100} source={{uri: this.state.profilePicture}} rounded/>
                <Button onPress={() => this.changePhoto()} style={{marginTop: 20}} titleStyle={{fontFamily: 'font1'}} title="Change Group Photo" type="clear"/>

                </View>
                <Text style={{fontFamily: 'font1', fontSize: 20, padding: 10}}>Participants</Text>
                    {this.renderParticipants()}
                </View>
                <Overlay animationType='fade' onBackdropPress={() => this._closeChatSettings()} isVisible={this.state.chatSettings} overlayStyle={{width: width, borderRadius: '10', position: 'absolute', bottom: 0}}>
                <View style={{flex: 1}}>
                    <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
                        <Avatar size={40} source={{uri: this.state.profilePicture}} rounded/>
                            <TouchableOpacity onPress={() => this._openProfileDetails()}>

                                    <View style={{flex: 0, alignItems: 'center'}}>
                                        <Text style={{fontFamily: 'font1', marginLeft: 6, fontSize: 18}}>{this.state.roomName}</Text>
                                        <View style={{flex: 0, flexDirection: 'row', alignItems: 'center', alignContent: 'center'}}>
                                        </View>
                                    </View>

                            </TouchableOpacity>
                    </View>
                    <Divider style={{marginTop: 10}}/>
                    <TouchableOpacity style={{padding: 10}}>
                        <Text style={{fontFamily: 'font1', fontSize: 18}}>Add Participant</Text>
                    </TouchableOpacity>
                    <Divider style={{marginTop: 0}}/>

                    <TouchableOpacity style={{padding: 10, paddingBottom: 20}}>
                        <Text style={{fontFamily: 'font1', fontSize: 18}}>Change Group Photo</Text>
                    </TouchableOpacity>
                    <Divider style={{marginTop: 0}}/>
                    <TouchableOpacity style={{padding: 10}}>
                        <Text style={{fontFamily: 'font1', fontSize: 18, color: 'red'}}>Exit Group</Text>
                    </TouchableOpacity>
                    <Divider style={{marginTop: 0}}/>
                    
                    <TouchableOpacity style={{padding: 10}}>
                        <Text style={{fontFamily: 'font1', fontSize: 18, color: '#b2b8c2', alignSelf: 'center'}}>Done</Text>
                    </TouchableOpacity>
                    </View>
                </Overlay>
            </Overlay>
            
                <View style={{flex: 0, flexDirection: 'row', justifyContent: 'space-between', padding: 10}}>
                <TouchableOpacity
                    // onPress={() => this.props.navigation.goBack()}
                  style={{
                    backgroundColor: 'transparent',
                    margin: 4,
                    marginRight: 10,
                 }}>
              <AntDesign
                  name="arrowleft"
                  style={{fontSize: 26, fontWeight: "bold"}}
              />
                          </TouchableOpacity> 
                          <Text style={{fontSize: 20, fontFamily: "font1", paddingTop: 5}}>{this.state.roomName}</Text>

                    <Avatar onPress={() => this._onTouchAvatar()} rounded source={{uri: this.state.profilePicture}}/>
                    
                
                </View>
                <Divider/>
                <View style={{flex: 1}}>
                    <Input
                        placeholderTextColor="#B1B1B1"
                        returnKeyType="done"
                        rightIcon={<Button title="Send" type="clear" onPress={() => {
                            if (this.state.currentMessage != "")
                                this.createMessage(this.state.currentMessage)
                            this.setState({ currentMessage: '' })
                        }}/>}
                        containerStyle={{position:'absolute',bottom:10}}
                        inputContainerStyle={{ paddingHorizontal: 10, borderWidth: 1, borderColor: "#b2b8c2",borderRadius: '20', height: 44}}
                        value={this.state.currentMessage}
                        onChangeText={currentMessage => this.setState({ currentMessage })}
                        renderErrorMessage={false}
                    />
                   
                   <Button title="Load more" titleStyle={{color: '#b2b8c2'}} type="clear" onPress={() => this.retrieveMore()}/>

                <FlatList
                    inverted
                    data={this.state.messages}
                    renderItem={({ item }) => (
                        <View>
                            {(typeof (item.location) === 'undefined') ? <MessageComponent msg={item.msg} date={item.timestamp} sender={item.sender} /> :
                                                <ChatRoomPost
                                                    postedFor={item.hoursPosted}
                                                    activity={item.activity}
                                                    mood={item.mood}
                                                    text={item.text}
                                                    creatorId={item.creatorId}
                                                    timestamp={item.timestamp}
                                                    image={item.image} />}
                            {/* <MessageComponent msg={item.msg} date={item.timestamp} sender={item.sender} /> */}
                        </View>
                    )}
                    keyExtractor={(item, index) => String(index)}
                    // ListHeaderComponent={this.renderHeader}
                    ListFooterComponent={this.Renderpizdamatii}
                    onEndReached={this.retrieveMore}
                    onEndReachedThreshold={0}
                    refreshing={this.state.refreshing}
                    // renderHeader={this.renderHeader}
                    style={{position:'absolute',top:0,bottom:65,left:5,right:5}}
                />
                </View>
                </View>
                


            

            // <SafeAreaView>
            //     <KeyboardAvoidingView
            //         behavior="position"
            //         style={styles.container}>

            //         <View style={styles.container}>

            //             <View style={{ width: width, height: height - 100 }}>

            //                 <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

            //                     <FlatList
            //                         data={this.state.messages}
            //                         renderItem={({ item }) => (
            //                             <View>
            //                                 {/* {(typeof (item.location) === 'undefined') ? <MessageComponent msg={item.msg} date={item.timestamp} sender={item.sender} /> :
            //                                     <ChatRoomPost
            //                                         postedFor={item.hoursPosted}
            //                                         activity={item.activity}
            //                                         mood={item.mood}
            //                                         text={item.text}
            //                                         creatorId={item.creatorId}
            //                                         timestamp={item.timestamp}
            //                                         image={item.image} />} */}
            //                                         <MessageComponent msg={item.msg} date={item.timestamp} sender={item.sender} />
            //                             </View>
            //                         )}
            //                         keyExtractor={(item, index) => String(index)}
            //                         ListHeaderComponent={this.renderHeader}
            //                         ListFooterComponent={this.renderFooter}
            //                         onEndReached={this.retrieveMore}
            //                         onEndReachedThreshold={0}
            //                         refreshing={this.state.refreshing}
            //                         renderHeader={this.renderHeader}


            //                     />
            //                 </TouchableWithoutFeedback>
            //                 <View style={{ paddingTop: 5 }}>
            //                     <Input

            //                         placeholder={"scrie un mesaj " + "Mihaitza Piticu" + '!'}
            //                         placeholderTextColor="#B1B1B1"
            //                         returnKeyType="done"
            //                         textContentType="newPassword"
            //                         rightIcon={<Icon type='ionicon' name='ios-send' size={30} onPress={() => {
            //                             if (this.state.currentMessage != "")
            //                                 this.createMessage(this.state.currentMessage)
            //                             this.setState({ currentMessage: '' })
            //                         }} />}
            //                         containerStyle={{ height: 0 }}
            //                         inputContainerStyle={{ paddingHorizontal: 15, borderWidth: 1, borderColor: "black", borderRadius: 30, height: 50 }}

            //                         value={this.state.currentMessage}
            //                         onChangeText={currentMessage => this.setState({ currentMessage })}
            //                         renderErrorMessage={false}
            //                     />
            //                 </View>
            //             </View>
            //         </View>

            //     </KeyboardAvoidingView>
            // </SafeAreaView>
        )


    }
}


export default withNavigation(ChatRoom)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',

    },
})
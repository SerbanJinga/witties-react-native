import React, { Component } from 'react'
import { Text, Input, Button, Icon, Divider, Avatar, Overlay } from 'react-native-elements'
import { Platform, KeyboardAvoidingView, View, StyleSheet, Dimensions, FlatList, Keyboard, TouchableWithoutFeedback, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native'
import MessageComponent from '../chatRoom/MessageComponent'
import firebase from 'firebase'
import { MaterialIcons, Feather, AntDesign } from '@expo/vector-icons'
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
import VideoComponent from './VideoComponent'
import StreakVideo from './StreakVideo'
import { SafeAreaView } from 'react-native-safe-area-context'
import FriendList from '../friendSystem/FriendList'
import AddParticipants from './AddParticipants'

let arrDocumentData = []
let globalLastVisible = ""
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
            lessMessages: [],
            refreshing: false,
            finishedReloading: false,
            lastVisible: 0,
            extraMessages: [],
            updateInMata: false,
            addParticipants: false
        }


    }

    pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [9, 16],
        })

        if (!result.cancelled) {

            this.props.navigation.navigate('SendPhoto', { photo: result.uri, width: result.width, height: result.height, chatRoomPhoto: this.state.profilePicture, chatRoomName: this.state.roomName, chatRoomId: this.state.roomId })
        }
    }

    pickVideo = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            aspect: [4, 3]
        })

        if (!result.cancelled) {
            this.props.navigation.navigate('SendVideo', { video: result.uri, chatRoomPhoto: this.state.profilePicture, chatRoomId: this.state.roomId })
        }
    }

    openCamera = () => {

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
            timestamp: Date.now(),
            msg: msg,
            sender: firebase.auth().currentUser.uid
        }
        //Adauga pe ecran instant
        let aru = []
        aru = this.state.messages
        aru.push(newMessage)
        this.setState({ message: aru })

        firebase.firestore().collection('messages').doc(this.state.roomId).update({
            lastUpdated: Date.now()
        })

        //seteaza in baza de date
        firebase.firestore().collection("messages").doc(this.state.roomId).collection('chats').add({
            // messages: firebase.firestore.FieldValue.arrayUnion(newMessage)
            timestamp: Date.now(),
            msg: msg,
            sender: firebase.auth().currentUser.uid
        })
        let temp = this.state.userData
        // userDataArray = userDataArray.filter(element => element.uid !== firebase.auth().currentUser.uid)
        temp = temp.filter(element => element.uid !== firebase.auth().currentUser.uid)
        temp.forEach(user => this.sendNotifications(user.tokens, user.displayName, this.state.roomName, newMessage.msg))

    }

    sendNotifications = async (token, uid, user, messageSent) => {
        const message = {
            to: token,
            sound: 'default',
            title: user,
            body: uid + " : " + messageSent,
            data: { data: 'goes here' },
            _displayInForeground: true
        }


        const response = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });
    }

    _renderTimestamps = (timestamp) => {
        let date = new Date(timestamp * 1000)
        let day = date.getDay()
        let month = date.getMonth() + 1
        let year = date.getUTCFullYear()
        return day + ":" + month + ":" + year


    }

    componentDidMount = async () => {
        arrDocumentData = []
        userDataArray = []
        await this.retrieveData()

        await this.retrieveParticipants()

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

    retrieveParticipants = async () => {
        let initalQuery = firebase.firestore().collection('messages').doc(this.state.roomId)
        let initalSnapshot = await initalQuery.get()
        let initialData = initalSnapshot.data().usersParticipating
     

        initialData.forEach(async user => await this.retrieveParticipantDetail(user))
    }
    retrieveParticipantDetail = async (uid) => {
        let userQuery = firebase.firestore().collection('users').doc(uid)
        let userSnapshot = await userQuery.get()
        let userData = userSnapshot.data()
        userDataArray.push(userData)
        // userDataArray = userDataArray.filter(element => element.uid !== firebase.auth().currentUser.uid)
        this.setState({
            userData: userDataArray
        })
        console.log('DATATETETATTTE')
    }




    retrieveData = async () => {
        let query = await firebase.firestore().collection('messages').doc(this.state.roomId).collection('chats').get()
        if (query.empty) { return }

        firebase.firestore().collection('messages').doc(this.state.roomId).collection('chats').orderBy('timestamp').limitToLast(15).get().then((docs => {

            docs.forEach((doc) => { arrDocumentData.push(doc.data()) })


            // let tata = docs.map(doc => doc.id)
            // console.log(tata)
            // this.reloadData(arrDocumentData)

            // console.log(arrDocumentData[0].timestamp)
            this.setState({ finishedReloading: true, lastVisible: arrDocumentData[0].timestamp, messages: arrDocumentData })
        }))

        firebase.firestore().collection('messages').doc(this.state.roomId).collection('chats').orderBy('timestamp', 'desc').limit(1).onSnapshot((doc) => {
            if (this.state.finishedReloading) {
                let documentData = doc.docs.map(doc => doc.data())
                if (documentData[0].sender !== firebase.auth().currentUser.uid) {
                    this.setState({
                        messages: [...this.state.messages, documentData[0]]
                    })
                }


            }
        })


    }


    reloadData = (docs) => {
        console.log('s-a transmis ft bine')
        this.setState({
            messages: docs
        })


    }

    // retrieveMore = async () => {
    //     let howManyLoadInPlus = 6
    //     let arrMsg = []
    //     let receivedQuery = await firebase.firestore().collection("messages").doc(this.state.roomId)
    //     let receivedSnapshots = await receivedQuery.get()
    //     let receivedData = receivedSnapshots.data().messages.slice(-6 + howManyLoadInPlus)
    //     receivedData.forEach(element => {
    //         arrMsg.push(element)
    //     })
    //     arrMsg.reverse()


    //     console.log('DAIFJAFJKAFJAKFJk')
    //     arrMsg.slice().sort((a, b) => a.timestamp - b.timestamp)
    //     this.setState({
    //         messages: arrMsg,
    //     })

    // }

    renderParticipants = () => {

        return (

            <FlatList
                data={this.state.userData}
                renderItem={({ item }) => (
                    <ChatParticipant displayName={item.displayName} profilePicture={item.profilePicture} discriminator={item.discriminator} />
                )}
                keyExtractor={(item, index) => String(index)}
            />
        )
    }

    renderStreakVideo = () => {
        return (
            <StreakVideo chatRoomName={this.state.roomId} />
        )
    }
    _retrieveImage = async () => {
        const path = `messages/profile-picture/${this.state.roomId}`
        const url = await firebase.storage().ref(path).getDownloadURL()
        this.setState({ imageUri: url })
    }

    changePhoto = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3]
        })

        if (!result.cancelled) {
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
        upload.on("state_changed", snapshot => { }, err => {
            console.log(err)
        },
            async () => {
                const url = await upload.snapshot.ref.getDownloadURL()
                console.log(url)
                this.setState({ imageUri: url })
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



    getReplier = async (id) => {
        let initialQuery = await firebase.firestore().collection('users').doc(id).get()
        let data = await initialQuery.data().displayName
        return String(data)
    }

    renderArr = () => {
        return (
            <View style={{ flexDirection: 'row', marginVertical: 'auto' }} >
                <TouchableOpacity onPress={() => this.pickImage()} style={{ marginRight: 8 }}>
                    <Feather name="image" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.pickVideo()}>
                    <Feather name="video" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={{ marginLeft: 8 }} onPress={() => this.props.navigation.navigate('ChatCameraScreen', { roomId: this.state.roomId, profilePicture: this.state.profilePicture })}>
                    <Feather name="camera" size={24} color="black" />
                </TouchableOpacity>
            </View>
        )
    }

    exitGroup = () => {
        Alert.alert(
            `Exit Group?`,
            "You can not turn back.",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log('nimic '),
                    style: 'cancel'
                },
                {
                    text: "Exit",
                    onPress: () => this.da(),
                    style: 'destructive'
                }
            ],
            { cancelable: false }
        )
    }
    da = async () => {
        await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update({
            chatRoomsIn: firebase.firestore.FieldValue.arrayRemove(this.state.roomId)
        }).then(this.props.navigation.goBack(null))
        await firebase.firestore().collection('messages').doc(this.state.roomId).update({
            usersParticipating: firebase.firestore.FieldValue.arrayRemove(firebase.auth().currentUser.uid)
        })

    }

    refresh = () => {

        this.setState({
            refreshing: true
        })
        setTimeout(async () => {

            // console.log(this.state.lastVisible)
           firebase.firestore().collection('messages').doc(this.state.roomId).collection('chats').orderBy('timestamp', "desc").startAfter(this.state.lastVisible).limit(6).onSnapshot((doc) => {
            if(doc.empty){
                this.setState({
                    refreshing: false
                })
                return
            }    
            let data = doc.docs.map(doc => doc.data())
            this.setState({
                lastVisible: data[data.length - 1].timestamp,

            })
            data.reverse()
            data = data.concat(this.state.messages)
            this.setState({
                messages: []
            })
            console.log('asta e data PLS', data)
            this.setState({
                messages: data,
                // lastVisible: data[data.length - 1].timestamp,
                refreshing: false
            })
            })
        
        }, 500)
    }
    openAddParticipants = () => {
        this.setState({
            addParticipants: true
        })
    }



    closeAddParticipants = () => {
        this.setState({
            addParticipants: false
        })
    }

    compareForNextDay = (date1, date2) => {
        let next1 = new Date(date1)
        let next2 = new Date(date2)
        if(next1.getDate() !== next2.getDate()){
            return true
        }
        return false
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>

                <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={styles.container}>
                    <Overlay fullScreen isVisible={this.state.changeChatOverlay} animationType="slide">
                        <SafeAreaView style={{ flex: 1 }}>
                            {/* <ScrollView style={{flex: 1}}> */}
                            <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <TouchableOpacity onPress={() => this._closeChatDetails()}>
                                    <AntDesign
                                        size={26}
                                        name="down"
                                        color="#b2b8c2"
                                    />
                                </TouchableOpacity>
                                <Text style={{ fontFamily: 'font1', fontSize: 20 }}>{this.state.roomName}</Text>
                                <TouchableOpacity onPress={() => this._openGroupSettings()}>
                                    <AntDesign
                                        size={26}
                                        name="bars"
                                        color="#b2b8c2"
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 0, alignItems: 'center', marginTop: 40 }}>
                                <Avatar size={100} source={{ uri: this.state.profilePicture }} rounded />
                                <Button onPress={() => this.changePhoto()} style={{ marginTop: 20 }} titleStyle={{ fontFamily: 'font1' }} title="Change Group Photo" type="clear" />

                            </View>
                            <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ fontFamily: 'font1', fontSize: 20, padding: 10 }}>Participants</Text>
                                <Button titleStyle={{ fontFamily: 'font1', fontSize: 15, margin: 10 }} onPress={() => this.openAddParticipants()} type="clear" title="Add" />
                            </View>
                            <Overlay isVisible={this.state.addParticipants} fullScreen animationType='slide'>
                                <SafeAreaView style={{ flex: 1 }}>
                                    {/* <FriendList close={() => this.closeAddParticipants()}/> */}
                                    <AddParticipants close={() => this.closeAddParticipants()} roomId={this.state.roomId} />
                                </SafeAreaView>
                            </Overlay>
                            {this.renderParticipants()}
                            <TouchableOpacity onPress={() => this.exitGroup()}>
                                <Text style={{ fontFamily: 'font1', fontSize: 15, margin: 4, alignSelf: 'center', color: 'red' }}>Exit Group</Text>
                            </TouchableOpacity>
                            {/* </ScrollView> */}
                        </SafeAreaView>
                        <Overlay animationType='fade' onBackdropPress={() => this._closeChatSettings()} isVisible={this.state.chatSettings} overlayStyle={{ width: width, borderRadius: 10, position: 'absolute', bottom: 0 }}>
                            <SafeAreaView style={{ flex: 1 }}>
                                <View style={{ flex: 0, flexDirection: 'row', alignItems: 'center' }}>
                                    <Avatar size={40} source={{ uri: this.state.profilePicture }} rounded />
                                    <TouchableOpacity onPress={() => this._openProfileDetails()}>

                                        <View style={{ flex: 0, alignItems: 'center' }}>
                                            <Text style={{ fontFamily: 'font1', marginLeft: 6, fontSize: 18 }}>{this.state.roomName}</Text>
                                            <View style={{ flex: 0, flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
                                            </View>
                                        </View>

                                    </TouchableOpacity>
                                </View>
                                <Divider style={{ marginTop: 10 }} />
                                <TouchableOpacity style={{ padding: 10 }} onPress={() => {
                                    this._closeChatSettings()
                                    this.openAddParticipants()
                                }}>
                                    <Text style={{ fontFamily: 'font1', fontSize: 18 }}>Add Participant</Text>
                                </TouchableOpacity>
                                <Divider style={{ marginTop: 0 }} />

                                <TouchableOpacity style={{ padding: 10, paddingBottom: 20 }} onPress={() => {
                                    this.changePhoto()
                                }}>
                                    <Text style={{ fontFamily: 'font1', fontSize: 18 }}>Change Group Photo</Text>
                                </TouchableOpacity>
                                <Divider style={{ marginTop: 0 }} />
                                <TouchableOpacity style={{ padding: 10 }} onPress={() => this.exitGroup()}>
                                    <Text style={{ fontFamily: 'font1', fontSize: 18, color: 'red' }}>Exit Group</Text>
                                </TouchableOpacity>
                                <Divider style={{ marginTop: 0 }} />

                                <TouchableOpacity style={{ padding: 10 }} onPress={() => this._closeChatSettings()}>
                                    <Text style={{ fontFamily: 'font1', fontSize: 18, color: '#b2b8c2', alignSelf: 'center' }}>Done</Text>
                                </TouchableOpacity>
                            </SafeAreaView>
                        </Overlay>
                    </Overlay>

                    <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-between', padding: 10, alignItems: 'center' }}>
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
                            />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 20, fontFamily: "font1", paddingTop: 0 }}>{this.state.roomName}</Text>

                        <Avatar onPress={() => this._onTouchAvatar()} rounded source={{ uri: this.state.profilePicture }} />


                    </View>
                    <Divider />
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                        <View style={{ flex: 1 }}>
                            <Input

                                placeholderTextColor="#B1B1B1"
                                returnKeyType="done"
                                rightIcon={this.state.currentMessage.length !== 0 ? <Button title="Send" type="clear" onPress={() => {
                                    if (this.state.currentMessage != "")
                                        this.createMessage(this.state.currentMessage)
                                    this.setState({ currentMessage: '' })
                                }} /> : this.renderArr()}
                                containerStyle={{ position: 'absolute', bottom: 10 }}
                                inputContainerStyle={{ paddingHorizontal: 10, borderWidth: 1, borderColor: "#b2b8c2", borderRadius: 20, height: 44 }}
                                value={this.state.currentMessage}
                                onChangeText={currentMessage => this.setState({ currentMessage: currentMessage })}
                                renderErrorMessage={false}
                            />

                            {/* <Button title="Load more" titleStyle={{color: '#b2b8c2'}} type="clear" onPress={() => this.retrieveMore()}/> */}

                            {/* <ScrollView> */}

                            <FlatList
                                ref={ref => this.flatList = ref}
                                refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.refresh()} />}
                                // initialNumToRender={this.state.messages.length / 2}
                                nestedScrollEnabled={true}
                                scrollEnabled={true}
                                onEndReached={() => { console.log('end ricid') }}
                                onEndReachedThreshold={0.5}
                                // initialScrollIndex={this.state.messages.length - 1}
                                // onScrollToIndexFailed={() => console.log('failed')}
                                // ref="flatList"
                                extraData={this.state.updateInMata}
                                data={this.state.messages}
                                renderItem={({ item, index }) => (
                                    <View key={index} style={{ width: width, flex: 1 }}>
                                        {/* {(typeof item.reply === 'undefined') ? null : <View><Text>{item.reply} has replied to your story!</Text></View>} */}
                                        {(typeof (item.location) === 'undefined') ? <MessageComponent newDay={(this.state.messages.length >= 2 && index >= 1) ? (this.compareForNextDay(item.timestamp, this.state.messages[index - 1].timestamp)) : false} msg={item.msg} date={item.timestamp} sender={item.sender} /> :
                                            (typeof item.video === 'undefined') ?
                                                <ChatRoomPost
                                                    item={item}
                                                    postedFor={item.hoursPosted}
                                                    activity={item.activity}
                                                    mood={item.mood}
                                                    msg={item.msg}
                                                    creatorId={item.creatorId}
                                                    timestamp={item.timestamp}
                                                    image={item.image}
                                                /> :
                                                <VideoComponent shouldFlip={item.shouldFlip} timestamp={item.timestamp} item={item} video={item.video} creatorId={item.creatorId} msg={item.msg} />
                                        }

                                        {/* <MessageComponent msg={item.msg} date={item.timestamp} sender={item.sender} /> */}
                                    </View>
                                )}
                                keyExtractor={(item, index) => String(index)}
                                // ListHeaderComponent={this.renderHeader}
                                // ListFooterComponent={this.Renderpizdamatii}
                                // onEndReached={this.retrieveMore}
                                // onEndReachedThreshold={0}
                                // refreshing={this.state.refreshing}
                                // renderHeader={this.renderHeader}
                                style={{ position: 'absolute', top: 0, bottom: 65, left: 5, right: 5 }}
                            />
                            {/* </ScrollView> */}
                        </View>
                    </TouchableWithoutFeedback>

                </KeyboardAvoidingView>

            </SafeAreaView>




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